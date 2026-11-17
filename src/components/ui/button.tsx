import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-display text-sm font-semibold tracking-wide transition-transform duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-pink text-ink hover:bg-gold",
        secondary: "border border-paper/35 bg-ink/30 text-paper hover:border-aqua hover:text-aqua",
        ghost: "bg-transparent text-paper hover:text-pink",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, asChild, type = "button", ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant }), className);
  if (asChild) return <Slot className={classes} {...props} />;
  return <button className={classes} type={type} {...props} />;
}
