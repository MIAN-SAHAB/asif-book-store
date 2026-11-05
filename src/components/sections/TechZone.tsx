"use client";

import { useRef, type MouseEvent } from "react";
import { Cpu, ShieldCheck, Wrench, Zap } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { gadgets, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton, BADGE_STYLES } from "@/components/ui/ProductCard";
import { TONE_CLASSES } from "@/components/ui/ProductAvatar";
import Stars from "@/components/ui/Stars";

const LAYOUT: Record<string, string> = {
  "gd-1": "lg:col-span-2 lg:row-span-2",
  "gd-4": "lg:col-span-2",
  "gd-5": "lg:row-span-2",
  "gd-8": "lg:col-span-2",
};
const ORDER = ["gd-1", "gd-2", "gd-3", "gd-4", "gd-5", "gd-6", "gd-7", "gd-9", "gd-8", "gd-10"];

const CIRCUITS = [
  "M0 120 H220 L260 160 V340 L300 380 H520",
  "M1440 200 H1180 L1140 240 V420 L1100 460 H900",
  "M0 640 H160 L200 600 H420 L460 640 V820",
  "M1440 720 H1280 L1240 760 V900 L1200 940 H980",
  "M720 0 V90 L760 130 H980 L1020 170 V260",
  "M300 1000 V880 L340 840 H560",
];

function GlowTile({ product, className = "" }: { product: Product; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = product.icon;
  const big = product.id === "gd-1";
  const tall = product.id === "gd-5";

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`glow-card tz-tile group relative rounded-[28px] p-px ${className}`}>
      <div className="glow-card-inner relative flex h-full flex-col overflow-hidden rounded-[27px] bg-[#070f30] p-5 sm:p-6">
        {/* Icon stage */}
        <div className={`relative flex flex-1 items-center justify-center ${big ? "min-h-56" : "min-h-32"}`}>
          <div className={`absolute h-2/3 w-2/3 rounded-full bg-gradient-to-br opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60 ${TONE_CLASSES[product.tone]}`} />
          <svg viewBox="0 0 200 200" className="absolute h-[80%] max-h-64 w-auto opacity-30" aria-hidden>
            <circle cx="100" cy="100" r="80" fill="none" stroke="#3f7bf5" strokeDasharray="3 6" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#ffd21f" strokeOpacity=".4" />
          </svg>
          <Icon
            size={big ? 140 : tall ? 110 : 64}
            strokeWidth={1}
            className="relative text-white drop-shadow-[0_0_30px_rgba(63,123,245,.8)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:scale-110 group-hover:text-gold-300"
          />
        </div>

        {/* Floating spec badges */}
        {product.specs?.map((s, i) => (
          <span
            key={s}
            data-speed={0.6 + i * 0.5}
            className={`tz-spec absolute rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] tracking-wider text-royal-200 uppercase backdrop-blur ${["top-5 right-5", "top-16 right-8", "top-28 right-4"][i]}`}
          >
            {s}
          </span>
        ))}
        {product.badge && (
          <span className={`absolute top-5 left-5 rounded-full px-3 py-1 text-[10px] tracking-wider uppercase ${BADGE_STYLES[product.badge]}`}>
            {product.badge}
          </span>
        )}

        <div className="relative mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[.2em] text-royal-300 uppercase">{product.sub}</p>
            <h3 className={`${big ? "text-2xl sm:text-3xl" : "text-lg"} leading-tight font-medium text-white`}>{product.name}</h3>
            {big && product.blurb && <p className="mt-2 max-w-sm text-xs text-white/55">{product.blurb}</p>}
            <div className="mt-2 flex items-center gap-3 text-white">
              <span className="font-heading text-lg font-semibold text-gold-300">{formatPrice(product.price)}</span>
              {big && <Stars rating={product.rating} reviews={product.reviews} className="text-white/70" />}
            </div>
          </div>
          <AddToCartButton product={product} variant="dark" />
        </div>
      </div>
    </div>
  );
}

/** Section 9 — dark tech bento with glowing borders, parallax spec badges and scroll-drawn circuitry. */
export default function TechZone() {
  const root = useRef<HTMLElement>(null);
  const tiles = ORDER.map((id) => gadgets.find((g) => g.id === id)).filter((p): p is Product => Boolean(p));

  useGSAP(
    () => {
      gsap.to(".tz-circuit", {
        strokeDashoffset: 0,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 60%", scrub: 0.8 },
      });
      gsap.fromTo(".tz-node", { scale: 0, transformOrigin: "50% 50%" }, {
        scale: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 50%", end: "bottom 60%", scrub: 0.8 },
      });
      gsap.utils.toArray<HTMLElement>(".tz-spec").forEach((el) => {
        const speed = Number(el.dataset.speed ?? 1);
        gsap.fromTo(
          el,
          { y: 40 * speed },
          { y: -40 * speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      gsap.utils.toArray<HTMLElement>(".tz-tile").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 100, autoAlpha: 0, rotateX: -25, transformPerspective: 1000 },
          {
            y: 0,
            autoAlpha: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: `top ${100 - (i % 4) * 3}%`, end: "top 65%", scrub: 0.6 },
          },
        );
      });
      gsap.fromTo(
        ".tz-heading span",
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".tz-heading", start: "top 90%", end: "top 50%", scrub: 0.6 } },
      );
    },
    { scope: root },
  );

  return (
    <section id="gadgets" ref={root} className="relative overflow-hidden bg-ink py-28 text-white sm:py-36">
      <svg viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {CIRCUITS.map((d) => (
          <path
            key={d}
            className="tz-circuit"
            d={d}
            fill="none"
            stroke="#0a5be0"
            strokeOpacity=".55"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        ))}
        {[
          [520, 380], [900, 460], [460, 820], [980, 940], [1020, 260], [560, 840],
        ].map(([x, y]) => (
          <circle key={`${x}${y}`} className="tz-node" cx={x} cy={y} r="7" fill="#ffd21f" />
        ))}
      </svg>
      <div className="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-royal-600/25 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="flex items-center gap-2 text-[11px] tracking-[.3em] text-gold-400 uppercase">
              <Cpu size={14} /> Electronic Gadgets &amp; Tech Zone
            </p>
            <h2 className="tz-heading mt-6 text-5xl leading-[0.9] font-semibold sm:text-7xl lg:text-8xl">
              <span className="block overflow-hidden">
                <span className="block">Plugged in</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block text-royal-400">for top marks.</span>
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {[
              { icon: ShieldCheck, t: "Official warranty" },
              { icon: Wrench, t: "In-store setup" },
              { icon: Zap, t: "Same-day pickup" },
            ].map(({ icon: I, t }) => (
              <span key={t} className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-white/80">
                <I size={14} className="text-gold-400" /> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 grid auto-rows-[minmax(260px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((p) => (
            <GlowTile key={p.id} product={p} className={LAYOUT[p.id] ?? ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
