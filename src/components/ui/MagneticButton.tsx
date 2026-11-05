"use client";

import type { ReactNode, MouseEvent } from "react";
import { gsap } from "@/lib/gsap";

type Variant = "gold" | "royal" | "outline" | "ghost-light" | "ink";

const VARIANTS: Record<Variant, string> = {
  gold: "bg-gold-400 text-royal-900 shadow-[0_10px_40px_-10px_rgba(245,184,0,.8)] hover:bg-gold-300",
  royal: "bg-royal-700 text-white shadow-[0_10px_40px_-10px_rgba(0,57,176,.8)] hover:bg-royal-600",
  outline: "border border-royal-800/25 text-royal-900 hover:border-royal-800 bg-white/40",
  "ghost-light": "border border-white/25 text-white hover:border-gold-400 hover:text-gold-300",
  ink: "bg-ink text-white hover:bg-royal-900",
};

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  strength?: number;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  fullWidth?: boolean;
}

/** Button/anchor that leans towards the cursor, with an inner label that moves further for depth. */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "gold",
  className = "",
  strength = 0.35,
  type = "button",
  disabled,
  ariaLabel,
  fullWidth = false,
}: MagneticButtonProps) {
  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: "power3.out" });
    gsap.to(gsap.utils.selector(el)(".mag-label"), {
      x: x * strength * 0.5,
      y: y * strength * 0.5,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const onLeave = (e: MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    gsap.to([el, ...gsap.utils.selector(el)(".mag-label")], { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
  };

  const cls = `relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-heading font-medium tracking-wide transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none ${VARIANTS[variant]} ${className}`;

  const label = <span className="mag-label inline-flex items-center gap-2">{children}</span>;

  return (
    <span className={`${fullWidth ? "block" : "inline-block"} will-change-transform`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {href ? (
        <a href={href} className={cls} onClick={onClick} aria-label={ariaLabel}>
          {label}
        </a>
      ) : (
        <button type={type} className={cls} onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
          {label}
        </button>
      )}
    </span>
  );
}
