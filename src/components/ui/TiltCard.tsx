"use client";

import type { ReactNode, MouseEvent } from "react";
import { gsap } from "@/lib/gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  max?: number;
}

/** 3D hover tilt with a moving glare highlight. */
export default function TiltCard({ children, className = "", max = 10 }: TiltCardProps) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    gsap.to(el, {
      rotateY: (px - 0.5) * max * 2,
      rotateX: (0.5 - py) * max * 2,
      transformPerspective: 900,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(gsap.utils.selector(el)(":scope > .tilt-glare"), {
      opacity: 1,
      background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.45), transparent 55%)`,
      duration: 0.3,
    });
  };

  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    gsap.to(gsap.utils.selector(el)(":scope > .tilt-glare"), { opacity: 0, duration: 0.4 });
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative [transform-style:preserve-3d] will-change-transform ${className}`}
    >
      {children}
      <div className="tilt-glare pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-overlay" />
    </div>
  );
}
