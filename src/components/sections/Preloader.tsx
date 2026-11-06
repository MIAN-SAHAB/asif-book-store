"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Seconds between `onComplete` (the handoff) and the moment the curtains are
 * far enough open to show the page. Hero/Navbar delay their intros by this so
 * they still play in view.
 */
export const PRELOADER_REVEAL_DELAY = 0.55;

const WORDS = ["Asif", "Book", "Store"];
const CATS = ["Books", "Uniforms", "Gadgets", "Watches"];

/**
 * Section 1 — Preloader.
 * Counter + progress bar + SVG ring draw + clip-path logo reveal,
 * then a layered split-curtain exit that hands off to the Hero.
 */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      html.classList.add("is-loading");
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const progress = { v: 0 };
      const LOAD = 2.4;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Initial ("from") states live in the Tailwind classes below so the
      // first paint already matches frame 0 — no flash of the final state.
      tl.to(".pl-char", { y: 0, rotate: 0, stagger: 0.035, duration: 1.1 }, 0.1)
        .to(".pl-cat", { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.8 }, 0.5)
        .to(".pl-ring", { strokeDashoffset: 0, autoRound: false, duration: LOAD, ease: "power2.inOut" }, 0.1)
        .to(".pl-ring-gold", { strokeDashoffset: 0.75, autoRound: false, duration: LOAD, ease: "power3.inOut" }, 0.2)
        .to(".pl-orbit", { rotate: 300, duration: LOAD + 0.6, ease: "power2.inOut" }, 0)
        .to(".pl-bar", { scaleX: 1, duration: LOAD, ease: "power2.inOut" }, 0.1)
        .to(
          progress,
          {
            v: 100,
            duration: LOAD,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
            },
          },
          0.1,
        )
        .to(".pl-logo", { clipPath: "circle(50%)", scale: 1, rotate: 0, duration: 1.6 }, 0.45)
        // ---- exit ----
        .addLabel("exit", LOAD + 0.35)
        .to(".pl-logo-wrap", { scale: 0.6, autoAlpha: 0, duration: 0.55, ease: "power3.in" }, "exit")
        .to(".pl-char", { yPercent: -120, stagger: 0.015, duration: 0.45, ease: "power3.in" }, "exit")
        .to([".pl-meta", ".pl-cat"], { autoAlpha: 0, duration: 0.3 }, "exit")
        // Handoff while the curtains are still closed and nothing is moving:
        // unlocking scroll, the React re-render and ScrollTrigger setup/refresh
        // all cost main-thread time. Any frames they drop land on a static
        // screen instead of in the middle of the curtain motion.
        .add(() => {
          html.classList.remove("is-loading");
          onComplete();
        }, "exit+=0.6")
        // Short still beat so the handoff work is finished before anything moves.
        .addLabel("reveal", "exit+=0.75")
        .to(".pl-panel-royal.top", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "reveal")
        .to(".pl-panel-royal.bottom", { yPercent: 100, duration: 1.2, ease: "expo.inOut" }, "reveal")
        .to(".pl-panel-gold.top", { yPercent: -100, duration: 1.2, ease: "expo.inOut" }, "reveal+=0.15")
        .to(".pl-panel-gold.bottom", { yPercent: 100, duration: 1.2, ease: "expo.inOut" }, "reveal+=0.15")
        .set(root.current, { display: "none" });

      return () => html.classList.remove("is-loading");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden" aria-label="Loading Asif Book Store" role="status">
      {/* Layered split curtains: gold underneath, royal on top */}
      <div className="pl-panel-gold top absolute will-change-transform inset-x-0 top-0 h-1/2 bg-gold-400" />
      <div className="pl-panel-gold bottom absolute will-change-transform inset-x-0 bottom-0 h-1/2 bg-gold-400" />
      <div className="pl-panel-royal top absolute will-change-transform inset-x-0 top-0 h-1/2 bg-royal-800" />
      <div className="pl-panel-royal bottom absolute will-change-transform inset-x-0 bottom-0 h-1/2 bg-royal-800" />

      {/* Subtle radial glow, same feel as the logo's background */}
      <div className="pl-meta absolute inset-0 will-change-[opacity] bg-[radial-gradient(circle_at_50%_45%,rgba(10,91,224,.9),transparent_60%)]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-10 text-white">
        <div className="pl-logo-wrap relative will-change-[transform,opacity] h-44 w-44 sm:h-56 sm:w-56">
          <svg viewBox="0 0 200 200" className="pl-orbit absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]">
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
            <circle
              className="pl-ring"
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke="#ffd21f"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
            <circle
              className="pl-ring-gold"
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#f5b800"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.25 1"
              strokeDashoffset="1"
              opacity=".5"
            />
            <circle cx="100" cy="4" r="4" fill="#ffd21f" />
          </svg>
          <div className="pl-logo absolute inset-0 overflow-hidden rounded-full shadow-[0_0_80px_rgba(255,210,31,.35)] [clip-path:circle(0%)] [transform:scale(1.4)_rotate(-25deg)]">
            <Image src="/assets/images/logo.jpeg" alt="Asif Book Store logo" fill sizes="224px" priority className="object-cover" />
          </div>
        </div>

        <h1 className="flex gap-4 text-5xl font-semibold tracking-tight uppercase sm:text-7xl">
          {WORDS.map((w) => (
            <span key={w} className="flex overflow-hidden pb-1">
              {w.split("").map((c, i) => (
                <span key={i} className="pl-char inline-block [transform:translateY(120%)_rotate(8deg)]">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] tracking-[.3em] text-gold-300 uppercase">
          {CATS.map((c) => (
            <span key={c} className="pl-cat invisible inline-block opacity-0 [transform:translateY(14px)]">
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="pl-meta absolute inset-x-6 bottom-8 flex items-end justify-between gap-6 text-white sm:inset-x-12">
        <div className="text-[11px] leading-relaxed tracking-[.2em] uppercase opacity-70">
          Authorized Dealer
          <br />
          The City School &amp; more
        </div>
        <div className="flex-1 self-center">
          <div className="h-px w-full bg-white/15">
            <div className="pl-bar h-px origin-left scale-x-0 bg-gold-400" />
          </div>
        </div>
        <span className="font-heading text-6xl leading-none font-semibold tabular-nums sm:text-8xl">
          <span ref={counter}>000</span>
          <span className="text-gold-400">%</span>
        </span>
      </div>
    </div>
  );
}
