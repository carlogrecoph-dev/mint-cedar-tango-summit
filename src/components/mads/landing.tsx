import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Menu, X } from "lucide-react";
import { portals, roles, services, ticker, ui } from "@/components/mads/copy";
import { NightCity } from "@/components/mads/city";
import { LanguageProvider, useLang } from "@/components/mads/language";
import { RequestForm } from "@/components/mads/request-form";
import { Button } from "@/components/ui/button";

const chapters = [
  { id: "vision", label: ui.k01, n: "01" },
  { id: "programme", label: ui.k02, n: "02" },
  { id: "madsverse", label: ui.k03, n: "03" },
  { id: "freedom", label: ui.k04, n: "04" },
  { id: "finale", label: ui.k05, n: "05" },
  { id: "advisory", label: ui.k06, n: "06" },
  { id: "apply", label: ui.k07, n: "07" },
];

function Shell() {
  const { lang, t, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("vision");
  const filmRef = useRef<HTMLDivElement>(null);
  const words = ticker[lang];
  const loop = [...words, ...words];

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px 8% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--mx", `${event.clientX}px`);
        hero.style.setProperty("--my", `${event.clientY}px`);
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nodes = chapters.map((chapter) => document.getElementById(chapter.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setCurrent(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const close = () => setOpen(false);

  const slideFilm = (direction: number) => {
    const node = filmRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("article");
    const amount = (card?.offsetWidth ?? 320) + 16;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <div className="overflow-x-clip bg-ink text-paper">
      <div className="hairline fixed inset-x-0 top-0 z-50 scale-x-0" id="scroll-progress" />
      <nav className="chapter-rail" aria-label={lang === "en" ? "Sections" : "Sezioni"}>
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className={current === chapter.id ? "is-on" : undefined}
            aria-label={t(chapter.label)}
            aria-current={current === chapter.id ? "true" : undefined}
          >
            {chapter.n}
          </a>
        ))}
      </nav>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-paper/10 bg-ink/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
          <a href="#top" className="display text-xl leading-none tracking-normal text-paper">
            M.A.D.S.
            <span className="brand-kicker hidden sm:block">ART GALLERY / 2027—29</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            <a className="text-sm font-semibold tracking-wide hover:text-pink" href="#programme">
              {t(ui.navProgram)}
            </a>
            <a className="text-sm font-semibold tracking-wide hover:text-pink" href="#madsverse">
              {t(ui.navVerse)}
            </a>
            <a className="text-sm font-semibold tracking-wide hover:text-pink" href="#finale">
              {t(ui.navFinale)}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="min-h-11 rounded-full border border-paper/30 px-4 text-xs font-bold tracking-widest"
              type="button"
              onClick={toggle}
              aria-label={t(ui.switchLang)}
            >
              {lang === "en" ? "IT / EN" : "EN / IT"}
            </button>
            <Button asChild className="hidden sm:inline-flex">
              <a href="#apply">
                {t(ui.getInTouch)}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            </Button>
            <button
              className="grid size-11 place-items-center rounded-full border border-paper/30 lg:hidden"
              type="button"
              aria-expanded={open}
              aria-label={open ? t(ui.close) : t(ui.menu)}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="grid gap-1 border-t border-paper/10 px-5 py-4 lg:hidden">
            <a className="min-h-11 py-2 text-lg" href="#programme" onClick={close}>
              {t(ui.navProgram)}
            </a>
            <a className="min-h-11 py-2 text-lg" href="#madsverse" onClick={close}>
              {t(ui.navVerse)}
            </a>
            <a className="min-h-11 py-2 text-lg" href="#finale" onClick={close}>
              {t(ui.navFinale)}
            </a>
            <a className="min-h-11 py-2 text-lg text-pink" href="#apply" onClick={close}>
              {t(ui.getInTouch)}
            </a>
          </div>
        ) : null}
      </header>

      <main>
        <section id="top" className="hero-stage relative flex min-h-svh items-end overflow-hidden pt-24">
          <img src="/art/city.jpg" alt={t(ui.cityAlt)} className="hero-photo absolute inset-0 h-full w-full object-cover" />
          <NightCity />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-scrim absolute inset-0" />
          <div className="year-stack" aria-hidden="true">
            <span>2027</span>
            <span>2028</span>
            <span>2029</span>
          </div>
          <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:py-24">
            <div className="title-box min-w-0">
              <p className="kicker rise rise-1 text-gold">{t(ui.eyebrow)}</p>
              <h1 className="display hero-title mt-5 text-paper">
                <span className="rise rise-2 block">ART</span>
                <em className="rise rise-3 block text-gold not-italic sm:italic">{lang === "en" ? "NEVER" : "NON SI"}</em>
                <span className="rise rise-4 block">{lang === "en" ? "STOPS" : "FERMA"}</span>
                <span className="rise rise-4 block">{lang === "en" ? "HERE." : "QUI."}</span>
              </h1>
              <p className="rise rise-5 mt-6 max-w-xl text-lg text-paper/80">{t(ui.heroLead)}</p>
              <div className="rise rise-6 mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href="#programme">
                    {t(ui.exploreYear)}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="#vision">{t(ui.discoverProject)}</a>
                </Button>
              </div>
            </div>
            <div className="rise rise-6 pace-row">
              <span>{t(ui.pace)}</span>
              <span className="text-aqua">{t(ui.scroll)}</span>
            </div>
          </div>
        </section>

        <div className="marquee bg-ink" aria-hidden="true">
          <div className="marquee-track">
            {loop.map((word, index) => (
              <span key={`${word}-${index}`}>✳ {word}</span>
            ))}
          </div>
        </div>

        <section id="vision" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:py-32">
          <div className="title-box reveal min-w-0">
            <p className="kicker text-gold">{t(ui.k01)}</p>
            <h2 className="display title mt-4 text-paper">
              {t(ui.visionTitleA)} <em className="text-pink">{t(ui.visionTitleB)}</em>
            </h2>
            <p className="mt-6 max-w-xl text-paper/75">{t(ui.visionLead)}</p>
          </div>
          <ol className="reveal grid">
            {roles.map((role) => (
              <li key={role.letter} className="role-line">
                <span className="display text-6xl text-aqua sm:text-7xl">{role.letter}</span>
                <span className="font-display text-2xl tracking-wide uppercase">{role[lang]}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="programme" className="border-t border-paper/10 bg-ink">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="title-box max-w-xl">
                <p className="kicker text-gold">{t(ui.k02)}</p>
                <h2 className="display title mt-4">
                  {t(ui.ecoTitleA)}
                  <span className="mt-2 block text-aqua italic">{t(ui.ecoTitleB)}</span>
                </h2>
                <p className="mt-6 text-paper/75">{t(ui.ecoLead)}</p>
              </div>
              <div className="flex gap-2">
                <button className="film-nav" type="button" onClick={() => slideFilm(-1)} aria-label={lang === "en" ? "Previous" : "Precedente"}>
                  <ArrowLeft className="size-5" />
                </button>
                <button className="film-nav" type="button" onClick={() => slideFilm(1)} aria-label={lang === "en" ? "Next" : "Successivo"}>
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
            <div className="film reveal mt-12" ref={filmRef}>
              {services.map((service, index) => (
                <article key={service.title.en} className="film-card">
                  <span className="display film-index">0{index + 1}</span>
                  <p className="kicker mt-6 text-pink">{t(service.index)}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">{t(service.title)}</h3>
                  <p className="mt-4 text-paper/75">{t(service.body)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="madsverse" className="relative overflow-hidden">
          <img src="/art/city.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/78" />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="title-box reveal max-w-3xl">
              <p className="kicker text-gold">{t(ui.k03)}</p>
              <h2 className="display title mt-4">
                {t(ui.worldTitleA)}
                <span className="mt-2 block italic text-gold">{t(ui.worldTitleB)}</span>
              </h2>
              <p className="mt-6 max-w-xl text-paper/80">{t(ui.worldLead)}</p>
            </div>
            <div className="portal-grid reveal mt-12">
              {portals.map((portal, index) => (
                <article key={portal.title.en} className="portal">
                  <p className="kicker text-aqua">0{index + 1}</p>
                  <h3 className="mt-3 font-display text-3xl font-bold">{t(portal.title)}</h3>
                  <p className="mt-3 text-paper/75">{t(portal.body)}</p>
                </article>
              ))}
            </div>
            <div className="reveal mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="kicker text-gold">{t(ui.enterVerse)}</p>
              <Button asChild variant="secondary">
                <a href="https://www.madsgallery.art" target="_blank" rel="noreferrer">
                  {t(ui.exploreMads)}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="freedom" className="bg-paper text-ink">
          <div className="title-box mx-auto max-w-6xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="reveal">
              <p className="kicker text-pink">{t(ui.k04)}</p>
              <h2 className="display title mt-4">
                {t(ui.freeTitleA)} <em>{t(ui.freeTitleB)}</em>
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-ink/75">{t(ui.freeLead)}</p>
            </div>
            <p className="reveal display title statement mt-16">
              {t(ui.aliveA)} <span className="text-pink">{t(ui.aliveB)}</span>
              <span className="mt-3 block">{t(ui.aliveC)}</span>
            </p>
            <ul className="reveal mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {[ui.pillYear, ui.pillRenew, ui.pillCommission].map((pill) => (
                <li key={pill.en} className="rounded-full border border-ink/20 px-4 py-3 text-sm font-semibold tracking-wide">
                  {t(pill)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="finale" className="finale-stage relative min-h-[80svh] overflow-hidden">
          <img src="/art/finale.jpg" alt={t(ui.finaleAlt)} className="absolute inset-0 h-full w-full object-cover" />
          <div className="finale-veil absolute inset-0" />
          <p className="year-mark pointer-events-none absolute right-0 bottom-0 text-paper/20" aria-hidden="true">
            2029
          </p>
          <div className="relative mx-auto flex min-h-[80svh] max-w-6xl items-end px-5 py-28 sm:px-8 lg:py-36">
            <div className="title-box reveal relative max-w-2xl">
              <p className="kicker text-gold">{t(ui.k05)}</p>
              <h2 className="display title mt-4">
                {t(ui.finaleTitleA)}
                <span className="mt-2 block italic text-aqua">{t(ui.finaleTitleB)}</span>
              </h2>
              <p className="mt-6 text-lg text-paper/80">{t(ui.finaleLead)}</p>
            </div>
          </div>
        </section>

        <section id="advisory" className="border-t border-paper/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-32">
            <div className="title-box reveal min-w-0">
              <p className="kicker text-gold">{t(ui.k06)}</p>
              <h2 className="display title mt-4">
                {t(ui.teamTitleA)}
                <span className="mt-2 block italic text-pink">{t(ui.teamTitleB)}</span>
              </h2>
              <p className="mt-6 text-paper/75">{t(ui.teamLead)}</p>
            </div>
            <div className="reveal dossier p-6 sm:p-8">
              <p className="kicker text-aqua">{t(ui.discoverFull)}</p>
              <p className="mt-4 text-paper/80">{t(ui.invite)}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <a href="#apply">
                    {t(ui.requestFull)}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="https://www.instagram.com/m.a.d.s.artgallery/" target="_blank" rel="noreferrer">
                    {t(ui.messageTeam)}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="apply" className="border-t border-paper/10">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-32">
            <div className="title-box reveal min-w-0">
              <p className="kicker text-gold">{t(ui.k07)}</p>
              <h2 className="display title mt-4">
                {t(ui.talkA)}
                <span className="mt-2 block italic text-gold">{t(ui.talkB)}</span>
              </h2>
              <p className="mt-6 text-paper/75">{t(ui.applyLead)}</p>
              <aside className="dossier mt-12 p-6">
                <p className="display text-3xl">
                  M<span className="text-pink">.</span>A<span className="text-aqua">.</span>D<span className="text-gold">.</span>S
                  <span className="text-pink">.</span>
                </p>
                <p className="kicker mt-6 text-gold">{t(ui.pressKicker)}</p>
                <h3 className="display mt-3 text-4xl">
                  {t(ui.pressTitleA)}
                  <span className="block">{t(ui.pressTitleB)}</span>
                </h3>
                <p className="mt-4 text-sm text-paper/70">{t(ui.pressLead)}</p>
                <Button asChild variant="secondary" className="mt-6">
                  <a href="/press/mads-triennale-2027-2029.pdf" download="MADS_TRIENNALE_2027_2029_PRESS_RELEASE_MADSVERSE.pdf">
                    <Download aria-hidden="true" className="size-4" />
                    {t(ui.download)}
                  </a>
                </Button>
                <p className="mt-3 text-xs tracking-wide text-paper/50">{t(ui.pressMeta)}</p>
              </aside>
            </div>
            <div className="reveal">
              <RequestForm />
            </div>
          </div>
        </section>
      </main>

      <section id="share" className="border-t border-paper/10">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="title-box min-w-0 max-w-2xl">
            <p className="kicker text-gold">{t(ui.shareKicker)}</p>
            <h2 className="display title mt-4 text-paper">{t(ui.shareTitle)}</h2>
            <p className="mt-4 max-w-xl text-paper/75">{t(ui.shareLead)}</p>
          </div>
          <Button asChild>
            <a href="/MADS_TRIENNALE_index.html" download="MADS_TRIENNALE_index.html">
              <Download aria-hidden="true" className="size-4" />
              {t(ui.shareDownload)}
            </a>
          </Button>
        </div>
      </section>

      <footer className="border-t border-paper/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-paper/70 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <strong className="font-display text-base tracking-wide text-paper">M.A.D.S. ART GALLERY</strong>
            <p>MEDIATOR · ADVISOR · DEALER · SEEKER</p>
          </div>
          <p>
            <a className="hover:text-pink" href="https://www.madsgallery.art" target="_blank" rel="noreferrer">
              madsgallery.art
            </a>
            <span> · </span>
            <a className="hover:text-pink" href="mailto:mads@madsgallery.art">
              mads@madsgallery.art
            </a>
          </p>
          <p>© M.A.D.S. / TRIENNALE 2027–2029</p>
        </div>
      </footer>
    </div>
  );
}

export function Landing() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
