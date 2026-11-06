"use client";

import type { MouseEvent, ReactNode } from "react";

type Variant = "gold" | "royal" | "outline" | "ghost-light" | "ink";

/** base = resting look, fill = colour of the hover blob, text = label colour once filled. */
const VARIANTS: Record<Variant, { base: string; fill: string; text: string }> = {
  gold: {
    base: "bg-gold-400 text-royal-900 shadow-[0_10px_40px_-10px_rgba(245,184,0,.8)]",
    fill: "bg-royal-800",
    text: "group-hover:text-gold-300 group-focus-visible:text-gold-300",
  },
  royal: {
    base: "bg-royal-700 text-white shadow-[0_10px_40px_-10px_rgba(0,57,176,.8)]",
    fill: "bg-gold-400",
    text: "group-hover:text-royal-900 group-focus-visible:text-royal-900",
  },
  outline: {
    base: "border border-royal-800/25 text-royal-900 bg-white/40 hover:border-royal-800",
    fill: "bg-royal-800",
    text: "group-hover:text-white group-focus-visible:text-white",
  },
  "ghost-light": {
    base: "border border-white/25 text-white hover:border-gold-400",
    fill: "bg-gold-400",
    text: "group-hover:text-royal-900 group-focus-visible:text-royal-900",
  },
  ink: {
    base: "bg-ink text-white",
    fill: "bg-gold-400",
    text: "group-hover:text-royal-900 group-focus-visible:text-royal-900",
  },
};

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  fullWidth?: boolean;
}

/**
 * Place the fill circle where the cursor crossed the edge, sized so it covers
 * the whole button from that point. Runs on enter and on leave, so the fill
 * grows in from the entry side and shrinks out towards the exit side.
 */
const setOrigin = (e: MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  const d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
  el.style.setProperty("--x", `${x}px`);
  el.style.setProperty("--y", `${y}px`);
  el.style.setProperty("--d", `${d}px`);
};

const EASE = "duration-500 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none";

/** Pill button/anchor: a fill grows from where the cursor enters, while the label rolls up to a fresh copy. */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "gold",
  className = "",
  type = "button",
  disabled,
  ariaLabel,
  fullWidth = false,
}: MagneticButtonProps) {
  const v = VARIANTS[variant];
  const cls = `group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-4 text-sm font-heading font-medium tracking-wide transition-[color,border-color] duration-300 disabled:opacity-40 disabled:pointer-events-none ${v.base} ${className}`;

  const inner = (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute top-[var(--y,50%)] left-[var(--x,50%)] -z-10 aspect-square w-[var(--d,250%)] -translate-1/2 scale-0 rounded-full transition-transform group-hover:scale-100 group-focus-visible:scale-100 ${EASE} ${v.fill}`}
      />
      <span className={`relative block overflow-hidden transition-colors duration-300 ${v.text}`}>
        <span className={`flex items-center justify-center gap-2 transition-transform group-hover:-translate-y-full group-focus-visible:-translate-y-full ${EASE}`}>
          {children}
        </span>
        <span
          aria-hidden
          className={`absolute inset-0 flex translate-y-full items-center justify-center gap-2 transition-transform group-hover:translate-y-0 group-focus-visible:translate-y-0 ${EASE}`}
        >
          {children}
        </span>
      </span>
    </>
  );

  return (
    <span className={fullWidth ? "block" : "inline-block"}>
      {href ? (
        <a href={href} className={cls} onClick={onClick} aria-label={ariaLabel} onMouseEnter={setOrigin} onMouseLeave={setOrigin}>
          {inner}
        </a>
      ) : (
        <button
          type={type}
          className={cls}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          onMouseEnter={setOrigin}
          onMouseLeave={setOrigin}
        >
          {inner}
        </button>
      )}
    </span>
  );
}
