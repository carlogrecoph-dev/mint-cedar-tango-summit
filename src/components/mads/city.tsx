import { useEffect, useRef } from "react";

type Block = {
  x: number;
  y: number;
  width: number;
  height: number;
  seed: number;
  depth: number;
};

export function NightCity() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let blocks: Block[] = [];
    let stars: { x: number; y: number; r: number }[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1 : 1.5);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = window.innerWidth < 820 ? 36 : 72;
      blocks = Array.from({ length: count }, (_, index) => ({
        x: (index / (count + 8)) * width + Math.random() * 26,
        y: height * 0.62 + Math.random() * height * 0.22,
        width: 8 + Math.random() * 26,
        height: 36 + Math.random() * Math.min(190, height * 0.42),
        seed: Math.random() * 10,
        depth: Math.random(),
      }));
      stars = Array.from({ length: window.innerWidth < 820 ? 40 : 86 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.72,
        r: Math.random() * 1.5 + 0.2,
      }));
    };

    const draw = () => {
      time += 0.007;
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        context.fillStyle = "rgba(246,241,255,0.38)";
        context.fillRect(star.x, star.y, star.r, star.r);
      }
      context.save();
      context.translate(width * 0.52, height * 0.9);
      for (let index = 0; index < 26; index += 1) {
        const y = -index * index * 1.85;
        context.strokeStyle = `rgba(139,247,237,${0.08 + index * 0.006})`;
        context.beginPath();
        context.moveTo(-width * 0.85, y);
        context.lineTo(width * 0.85, y);
        context.stroke();
      }
      for (let index = -22; index <= 22; index += 1) {
        context.strokeStyle = "rgba(139,247,237,0.14)";
        context.beginPath();
        context.moveTo(index * 48, -height * 0.72);
        context.lineTo(index * 86, 0);
        context.stroke();
      }
      context.restore();
      for (const block of blocks) {
        const shimmer = 0.28 + 0.32 * Math.sin(time * 2 + block.seed);
        const x = block.x + Math.sin(time + block.seed) * 2;
        context.fillStyle = `rgba(12,8,32,${0.42 + block.depth * 0.36})`;
        context.fillRect(x, block.y - block.height, block.width, block.height);
        context.strokeStyle =
          block.depth > 0.5
            ? `rgba(255,125,199,${0.22 + shimmer * 0.45})`
            : `rgba(139,247,237,${0.22 + shimmer * 0.4})`;
        context.strokeRect(x, block.y - block.height, block.width, block.height);
        for (let row = 8; row < block.height - 6; row += 12) {
          context.fillStyle = `rgba(246,243,154,${(row % 24 === 8 ? 0.2 : 0.05) + shimmer * 0.12})`;
          context.fillRect(x + 4, block.y - block.height + row, 2, 3);
          context.fillRect(x + block.width - 6, block.y - block.height + row, 2, 3);
        }
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || document.hidden || now - last < 33) return;
      last = now;
      draw();
    };

    resize();
    draw();
    const onResize = () => {
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);
    const resizeObserver = new ResizeObserver(onResize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    observer.observe(canvas);
    if (!reduce) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="night-city" aria-hidden="true" />;
}
