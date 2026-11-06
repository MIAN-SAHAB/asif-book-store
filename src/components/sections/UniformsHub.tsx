"use client";

import { useMemo, useRef, useState } from "react";
import { Ruler, ShieldCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { uniforms } from "@/lib/products";
import Eyebrow from "@/components/ui/Eyebrow";
import ProductCard from "@/components/ui/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const TAGS = ["All Schools", "The City School", "Beaconhouse", "Lahore Grammar School", "Roots Millennium"] as const;
type Tag = (typeof TAGS)[number];

const SIZES = [
  { size: "XS", age: "4–5 yrs", chest: 56, length: 42, waist: 50 },
  { size: "S", age: "6–7 yrs", chest: 62, length: 46, waist: 54 },
  { size: "M", age: "8–9 yrs", chest: 68, length: 51, waist: 58 },
  { size: "L", age: "10–11 yrs", chest: 74, length: 56, waist: 62 },
  { size: "XL", age: "12–13 yrs", chest: 82, length: 61, waist: 66 },
  { size: "XXL", age: "14+ yrs", chest: 90, length: 66, waist: 72 },
];

/** Section 7 — split layout: sticky left panel (tags + size guide), scrolling uniform products on the right. */
export default function UniformsHub() {
  const root = useRef<HTMLElement>(null);
  const [tag, setTag] = useState<Tag>("All Schools");
  const [size, setSize] = useState(2);

  const items = useMemo(() => (tag === "All Schools" ? uniforms : uniforms.filter((u) => u.school === tag)), [tag]);
  const s = SIZES[size];

  useGSAP(
    () => {
      const st = { trigger: root.current, start: "top 70%", end: "bottom bottom", scrub: 0.6 };
      gsap.to(".u-shirt-path", { strokeDashoffset: 0, autoRound: false, stagger: 0.05, ease: "none", scrollTrigger: st });
      gsap.fromTo(".u-progress", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { ...st, start: "top top" } });
      gsap.fromTo(
        ".u-hanger",
        { rotation: -18, svgOrigin: "300 40" },
        { rotation: 12, svgOrigin: "300 40", ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.fromTo(
        ".u-left > *",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 20%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="uniforms" ref={root} className="relative bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Sticky panel */}
        <div className="relative lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:self-start">
          {/* Shirt outline drawing in the background */}
          <svg
            viewBox="0 0 600 600"
            className="pointer-events-none absolute top-1/2 left-1/2 -z-0 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 opacity-[.12]"
            aria-hidden
          >
            <g className="u-hanger">
              {[
                "M300 40 C 300 20, 330 20, 330 40 C 330 55, 300 60, 300 75",
                "M300 75 L120 150 L480 150 Z",
                "M220 150 L260 135 C 280 165, 320 165, 340 135 L380 150 L480 220 L440 300 L400 275 L400 540 L200 540 L200 275 L160 300 L120 220 Z",
                "M300 165 L300 540",
                "M240 330 L290 330 M310 330 L360 330",
              ].map((d, i) => (
                <path
                  key={i}
                  className="u-shirt-path"
                  d={d}
                  fill="none"
                  stroke="#00227a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                />
              ))}
            </g>
          </svg>

          <div className="u-left relative z-10 py-24 lg:py-0">
            <Eyebrow>Official Uniforms &amp; Gear</Eyebrow>
            <h2 className="mt-6 text-5xl leading-[0.9] font-semibold text-royal-900 sm:text-6xl">
              Dressed for <span className="text-royal-600">assembly.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm text-ink/65">
              Authorized uniforms with the right fabric, colour and crest — plus shoes, bags and sportswear. Filter by
              school and check your fit below.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs transition ${t === tag ? "bg-royal-800 text-white" : "bg-royal-50 text-royal-800 hover:bg-royal-100"}`}
                >
                  {t === "The City School" && <ShieldCheck size={13} className={t === tag ? "text-gold-400" : "text-royal-600"} />}
                  {t}
                </button>
              ))}
            </div>

            {/* Size guide */}
            <div className="mt-8 rounded-3xl bg-cream p-5 ring-1 ring-ink/5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 font-heading text-lg font-medium text-royal-900">
                  <Ruler size={18} className="text-gold-600" /> Size guide
                </p>
                <span className="text-xs text-ink/50">{s.age}</span>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-1.5">
                {SIZES.map((sz, i) => (
                  <button
                    key={sz.size}
                    onClick={() => setSize(i)}
                    className={`rounded-xl py-2 text-xs font-medium transition ${i === size ? "bg-gold-400 text-royal-900 shadow" : "bg-white text-ink/70 hover:bg-royal-50"}`}
                  >
                    {sz.size}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {(
                  [
                    ["Chest", s.chest],
                    ["Length", s.length],
                    ["Waist", s.waist],
                  ] as const
                ).map(([label, v]) => (
                  <div key={label} className="rounded-2xl bg-white p-3">
                    <p className="text-[10px] tracking-widest uppercase opacity-50">{label}</p>
                    <p key={`${label}-${v}`} className="animate-fade-up font-heading text-2xl font-semibold text-royal-800">
                      {v}
                      <span className="text-xs font-normal opacity-60"> cm</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-[-2rem] hidden h-full w-px bg-ink/10 lg:block">
            <div className="u-progress h-full w-full origin-top bg-gold-500" />
          </div>
        </div>

        {/* Scrolling products */}
        <div className="pb-24 lg:py-32">
          <div key={tag} className="grid gap-5 sm:grid-cols-2">
            {items.map((p, i) => (
              <ScrollReveal key={p.id} x={i % 2 ? 80 : -40} y={60} className={i % 2 ? "sm:translate-y-16" : ""}>
                <div className="h-full animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ProductCard product={p} />
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="mt-24 text-center text-xs text-ink/50">
            Embroidery &amp; name tags available in-store · Free exchange within 14 days
          </p>
        </div>
      </div>
    </section>
  );
}
