"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Horizontal offset to start from (px). */
  x?: number;
  y?: number;
  rotate?: number;
  /** ScrollTrigger start / end, relative to the element. */
  start?: string;
  end?: string;
}

/**
 * Scrubbed, self-contained reveal. Each instance owns its ScrollTrigger and
 * reverts it on unmount, so it is safe inside filtered / re-keyed lists.
 */
export default function ScrollReveal({
  children,
  className = "",
  x = 0,
  y = 70,
  rotate = 0,
  start = "top 98%",
  end = "top 70%",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { x, y, rotate, autoAlpha: 0, scale: 0.94 },
        {
          x: 0,
          y: 0,
          rotate: 0,
          autoAlpha: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start, end, scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
