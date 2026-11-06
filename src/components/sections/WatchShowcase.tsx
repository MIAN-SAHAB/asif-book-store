"use client";

import { useRef } from "react";
import { Gem } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { watches } from "@/lib/products";
import { dialTicks, gearPath } from "@/lib/format";
import ProductCard from "@/components/ui/ProductCard";

const NUMERALS = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

/** Section 10 — 300vh parent, sticky stage: giant scroll-rotating dial + horizontally sliding watch cards. */
export default function WatchShowcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      const distance = () => {
        const el = track.current;
        if (!el) return 0;
        return -(el.scrollWidth - window.innerWidth + Math.min(window.innerWidth * 0.08, 96));
      };

      tl.fromTo(track.current, { x: () => window.innerWidth * 0.35 }, { x: distance, duration: 1 }, 0)
        .to(".wd-dial", { rotation: 360, svgOrigin: "500 500", duration: 1 }, 0)
        .to(".wd-gear-a", { rotation: -720, svgOrigin: "380 610", duration: 1 }, 0)
        .to(".wd-gear-b", { rotation: 540, svgOrigin: "620 400", duration: 1 }, 0)
        .to(".wd-hour", { rotation: 360, svgOrigin: "500 500", duration: 1 }, 0)
        .to(".wd-minute", { rotation: 360 * 12, svgOrigin: "500 500", duration: 1 }, 0)
        .to(".wd-progress", { scaleX: 1, duration: 1 }, 0)
        .fromTo(".wd-copy", { autoAlpha: 1, y: 0 }, { autoAlpha: 0.15, y: -40, duration: 0.3 }, 0.6);

      // Draw the dial as the section arrives.
      gsap.to(".wd-draw", {
        strokeDashoffset: 0, autoRound: false,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 90%", end: "top top", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  const C = 500;

  return (
    <section id="watches" ref={root} className="relative h-[300vh] bg-royal-950 text-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,#0039b0_0%,#00175a_40%,#030822_80%)]" />

        {/* Giant dial */}
        <svg
          viewBox="0 0 1000 1000"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-60"
          aria-hidden
        >
          <g className="wd-dial">
            <circle className="wd-draw" cx={C} cy={C} r="470" fill="none" stroke="#f5b800" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
            <circle className="wd-draw" cx={C} cy={C} r="440" fill="none" stroke="#f5b800" strokeOpacity=".4" strokeWidth="1" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
            <path d={dialTicks(C, C, 430, 60)} stroke="#ffd21f" strokeOpacity=".7" strokeWidth="3" />
            {NUMERALS.map((n, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              return (
                <text
                  key={n}
                  x={Math.round(C + Math.cos(a) * 350)}
                  y={Math.round(C + Math.sin(a) * 350)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gold-300 font-heading text-[44px]"
                  opacity=".55"
                >
                  {n}
                </text>
              );
            })}
          </g>
          <g className="wd-gear-a">
            <path d={gearPath(380, 610, 130, 110, 24)} fill="none" stroke="#3f7bf5" strokeOpacity=".6" strokeWidth="2" />
            <circle cx="380" cy="610" r="40" fill="none" stroke="#3f7bf5" strokeOpacity=".6" strokeWidth="2" />
          </g>
          <g className="wd-gear-b">
            <path d={gearPath(620, 400, 95, 80, 18)} fill="none" stroke="#ffd21f" strokeOpacity=".45" strokeWidth="2" />
            <circle cx="620" cy="400" r="22" fill="none" stroke="#ffd21f" strokeOpacity=".45" strokeWidth="2" />
          </g>
          <line className="wd-hour" x1={C} y1={C} x2={C} y2={C - 230} stroke="#ffd21f" strokeWidth="10" strokeLinecap="round" />
          <line className="wd-minute" x1={C} y1={C} x2={C} y2={C - 360} stroke="#fff" strokeOpacity=".8" strokeWidth="4" strokeLinecap="round" />
          <circle cx={C} cy={C} r="16" fill="#ffd21f" />
        </svg>

        <div className="wd-copy relative z-10 mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-32">
          <p className="flex items-center gap-2 text-[11px] tracking-[.3em] text-gold-400 uppercase">
            <Gem size={14} /> Watches &amp; Timepieces
          </p>
          <h2 className="mt-5 max-w-2xl text-5xl leading-[0.9] font-semibold sm:text-7xl">
            Timepieces that <span className="text-gold-gradient">outlast the term.</span>
          </h2>
        </div>

        <div className="absolute inset-x-0 bottom-[6vh] z-10">
          <div ref={track} className="flex w-max gap-5 pl-5 sm:pl-8">
            {watches.map((w) => (
              <div key={w.id} className="w-[230px] shrink-0 sm:w-[270px]">
                <ProductCard product={w} variant="lux" />
              </div>
            ))}
          </div>
          <div className="mx-auto mt-6 h-px max-w-7xl bg-white/15 px-5 sm:px-8">
            <div className="wd-progress h-full origin-left scale-x-0 bg-gold-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
