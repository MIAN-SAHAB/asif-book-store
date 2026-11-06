"use client";

import { useRef } from "react";
import { BookOpen, Cpu, Shirt, Watch } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatNumber } from "@/lib/format";

const METRICS = [
  { value: 28, suffix: "+", label: "Years of Trust", note: "Serving families since 1998" },
  { value: 40, suffix: "+", label: "Partner Schools", note: "Authorized books & uniforms" },
  { value: 1200000, suffix: "+", label: "Products Sold", note: "Across all four departments", compact: true },
  { value: 85000, suffix: "+", label: "Happy Families", note: "And counting every term", compact: true },
];

const MARKERS = [
  { x: 180, y: 190, icon: BookOpen, at: 0.12 },
  { x: 560, y: 110, icon: Shirt, at: 0.38 },
  { x: 900, y: 250, icon: Cpu, at: 0.62 },
  { x: 1260, y: 120, icon: Watch, at: 0.88 },
];

const PATH =
  "M-20 200 C 80 200, 120 120, 180 190 S 300 300, 380 220 C 450 150, 470 60, 560 110 C 650 160, 600 260, 700 260 S 820 140, 900 250 C 960 330, 1060 300, 1120 220 C 1170 150, 1200 80, 1260 120 C 1330 165, 1380 200, 1460 180";

/** Section 8 — a continuous SVG path draws across the screen; counters scrub up alongside it. */
export default function BrandMetrics() {
  const root = useRef<HTMLElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom bottom", scrub: 0.8 },
      });

      tl.to(".metric-path", { strokeDashoffset: 0, autoRound: false, duration: 1 }, 0).to(
        ".metric-path-glow",
        { strokeDashoffset: 0, autoRound: false, duration: 1 },
        0,
      );

      MARKERS.forEach((m, i) => {
        tl.fromTo(`.metric-marker-${i}`, { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.08, ease: "back.out(2)" }, m.at);
      });

      METRICS.forEach((m, i) => {
        const counter = { v: 0 };
        const el = valueRefs.current[i];
        tl.to(
          counter,
          {
            v: m.value,
            duration: 0.3,
            ease: "power1.out",
            onUpdate: () => {
              if (!el) return;
              el.textContent = m.compact
                ? m.value >= 1e6
                  ? `${(counter.v / 1e6).toFixed(1)}M`
                  : `${Math.round(counter.v / 1000)}K`
                : formatNumber(counter.v);
            },
          },
          MARKERS[i].at - 0.05,
        ).fromTo(`.metric-card-${i}`, { y: 60, autoAlpha: 0.15 }, { y: 0, autoAlpha: 1, duration: 0.15 }, MARKERS[i].at - 0.08);
      });
    },
    { scope: root },
  );

  return (
    <section aria-label="Asif Book Store in numbers" ref={root} className="relative overflow-hidden bg-royal-800 py-28 text-white sm:py-36">
      <div className="bg-grain absolute inset-0 opacity-[.06] mix-blend-overlay" />
      <div className="relative mx-auto max-w-7xl px-5 text-center sm:px-8">
        <p className="text-[11px] tracking-[.3em] text-gold-400 uppercase">Since 1998</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl leading-[0.95] font-semibold sm:text-6xl">
          One thread runs through every school year.
        </h2>
      </div>

      <div className="relative mt-16 h-[260px] w-full sm:h-[340px]">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={PATH} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="2" strokeDasharray="6 10" />
          <path
            className="metric-path-glow"
            d={PATH}
            fill="none"
            stroke="#ffd21f"
            strokeOpacity=".35"
            strokeWidth="18"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            style={{ filter: "blur(10px)" }}
          />
          <path
            className="metric-path"
            d={PATH}
            fill="none"
            stroke="#ffd21f"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
        {MARKERS.map((m, i) => {
          const Icon = m.icon;
          return (
            <span
              key={i}
              className={`metric-marker-${i} absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-400 text-royal-900 shadow-[0_0_0_8px_rgba(255,210,31,.2)] sm:h-14 sm:w-14`}
              style={{ left: `${(m.x / 1440) * 100}%`, top: `${(m.y / 400) * 100}%` }}
            >
              <Icon size={22} />
            </span>
          );
        })}
      </div>

      <div className="relative mx-auto mt-12 max-w-7xl px-5 sm:px-8">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <div key={m.label} className={`metric-card-${i} bg-royal-800 p-6 sm:p-10`}>
            <p className="font-heading text-5xl font-semibold tracking-tight text-gold-gradient sm:text-7xl">
              <span
                ref={(el) => {
                  valueRefs.current[i] = el;
                }}
              >
                0
              </span>
              {m.suffix}
            </p>
            <p className="mt-3 font-heading text-lg">{m.label}</p>
            <p className="text-xs opacity-60">{m.note}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
