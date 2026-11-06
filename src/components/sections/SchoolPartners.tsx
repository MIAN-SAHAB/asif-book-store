"use client";

import { useMemo, useRef, useState } from "react";
import { Check, GraduationCap, School as SchoolIcon, ShieldCheck, ShoppingBag } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  SCHOOLS,
  SCHOOL_LEVELS,
  buildSchoolKit,
  type Product,
  type School,
  type SchoolLevel,
  type Tone,
} from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";
import Eyebrow from "@/components/ui/Eyebrow";
import MagneticButton from "@/components/ui/MagneticButton";

const ROW_A = SCHOOLS.slice(0, 4);
const ROW_B = SCHOOLS.slice(4);

/** Section 4 — Authorized school partners: sticky scroll-scrubbed marquee + kit selector. */
export default function SchoolPartners() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".sp-track", start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      tl.fromTo(".sp-row-a", { xPercent: 0 }, { xPercent: -50, duration: 1 }, 0)
        .fromTo(".sp-row-b", { xPercent: -50 }, { xPercent: 0, duration: 1 }, 0)
        .fromTo(".sp-feature", { scale: 0.55, rotate: -8, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.35 }, 0.05)
        .to(".sp-crest-path", { strokeDashoffset: 0, autoRound: false, duration: 0.45, stagger: 0.03 }, 0.1)
        .fromTo(".sp-badge", { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.25 }, 0.25)
        .to(".sp-feature", { yPercent: -12, duration: 0.4 }, 0.6)
        .to(".sp-progress", { scaleX: 1, duration: 1 }, 0);

      gsap.fromTo(
        ".sp-heading-word",
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".sp-track", start: "top 80%", end: "top 10%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="schools" ref={root} className="relative bg-royal-800 text-white">
      {/* ---- Sticky marquee (tall parent + sticky child, no pinning) ---- */}
      <div className="sp-track relative h-[260vh]">
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(10,91,224,.9),transparent_65%)]" />
          <div className="bg-grain absolute inset-0 opacity-[.07] mix-blend-overlay" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
            <Eyebrow tone="gold">Authorized School Partners</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-4xl leading-[0.95] font-semibold sm:text-6xl">
              {"Official books & uniforms for the schools you trust.".split(" ").map((w, i) => (
                <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-top">
                  <span className="sp-heading-word inline-block">{w}</span>
                </span>
              ))}
            </h2>
          </div>

          <div className="relative z-0 mt-10 flex flex-col gap-4 sm:mt-14">
            <div className="sp-row-a flex w-max gap-10 whitespace-nowrap">
              {[...ROW_A, ...ROW_A, ...ROW_A, ...ROW_A].map((s, i) => (
                <span key={i} className={`font-heading text-[11vw] leading-none font-semibold sm:text-[8vw] ${i % 2 ? "text-stroke-gold" : "text-white"}`}>
                  {s} <span className="text-gold-400">✦</span>
                </span>
              ))}
            </div>
            <div className="sp-row-b flex w-max gap-10 whitespace-nowrap">
              {[...ROW_B, ...ROW_B, ...ROW_B, ...ROW_B].map((s, i) => (
                <span key={i} className={`font-heading text-[11vw] leading-none font-semibold sm:text-[8vw] ${i % 2 ? "text-white/90" : "text-stroke"}`}>
                  {s} <span className="text-gold-400">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Featured partner card floating over the marquee */}
          <div className="sp-feature absolute right-5 bottom-[8%] z-20 w-[min(88vw,380px)] rounded-[32px] bg-gold-400 p-6 text-royal-900 shadow-[0_40px_100px_-30px_rgba(0,0,0,.6)] sm:right-12">
            <div className="flex items-start gap-4">
              <svg viewBox="0 0 80 96" className="h-20 w-16 shrink-0" aria-hidden>
                {[
                  "M40 4 L74 16 L74 50 C74 72 58 86 40 92 C22 86 6 72 6 50 L6 16 Z",
                  "M22 40 L40 30 L58 40 L40 50 Z",
                  "M28 46 L28 58 C34 64 46 64 52 58 L52 46",
                  "M58 40 L58 56",
                  "M20 72 L60 72",
                ].map((d, i) => (
                  <path
                    key={i}
                    className="sp-crest-path"
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
              </svg>
              <div>
                <p className="text-[10px] tracking-[.25em] uppercase opacity-70">Featured partner</p>
                <p className="font-heading text-2xl leading-tight font-semibold">The City School</p>
                <p className="mt-1 text-xs opacity-75">Authorized dealer for course books, uniforms &amp; crested gear — every campus, every class.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Course Books", "Uniforms", "Sports Kits", "Bags"].map((b) => (
                <span key={b} className="sp-badge rounded-full bg-royal-900 px-3 py-1 text-[11px] text-gold-300">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute top-[22%] right-[8%] hidden lg:block">
            <div className="sp-badge glass-dark flex items-center gap-3 rounded-2xl px-4 py-3">
              <ShieldCheck className="text-gold-400" />
              <div className="text-xs leading-tight">
                <b className="block font-heading text-base">100% Official</b>
                School-approved stock
              </div>
            </div>
          </div>
          <div className="absolute bottom-[12%] left-[6%] hidden lg:block">
            <div className="sp-badge glass-dark flex items-center gap-3 rounded-2xl px-4 py-3">
              <GraduationCap className="text-gold-400" />
              <div className="text-xs leading-tight">
                <b className="block font-heading text-base">40+ Schools</b>
                Pre-school to O-Level
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div className="sp-progress h-full origin-left scale-x-0 bg-gold-400" />
          </div>
        </div>
      </div>

      <KitSelector />
    </section>
  );
}

/* ------------------------------------------------------------------ */

const KIT_TONES: Tone[] = ["royal", "sky", "ink", "gold", "ember", "mint", "plum"];

function KitSelector() {
  const root = useRef<HTMLDivElement>(null);
  const [school, setSchool] = useState<School>("The City School");
  const [level, setLevel] = useState<SchoolLevel>("Primary (1–5)");
  const [excluded, setExcluded] = useState<string[]>([]);
  const { addMany } = useCart();

  const kit = useMemo(() => buildSchoolKit(school, level), [school, level]);
  const chosen = kit.filter((k) => !excluded.includes(k.id));
  const total = chosen.reduce((n, k) => n + k.price, 0);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ks-receipt",
        { y: 140, rotate: 4 },
        { y: 0, rotate: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: 0.6 } },
      );
      gsap.fromTo(
        ".ks-school",
        { x: -60, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 35%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  const pickSchool = (s: School) => {
    setSchool(s);
    setExcluded([]);
  };
  const pickLevel = (l: SchoolLevel) => {
    setLevel(l);
    setExcluded([]);
  };
  const toggle = (id: string) =>
    setExcluded((ex) => (ex.includes(id) ? ex.filter((x) => x !== id) : [...ex, id]));

  const addKit = () => {
    const products: Product[] = chosen.map((k, i) => ({
      id: k.id,
      name: k.name,
      category: k.category,
      sub: level,
      school,
      price: k.price,
      rating: 4.9,
      reviews: 0,
      badge: "Authorized",
      icon: k.icon,
      tone: KIT_TONES[i % KIT_TONES.length],
    }));
    addMany(products, `${school} kit (${products.length} items) added to cart`);
  };

  return (
    <div ref={root} className="relative overflow-hidden bg-cream pt-52 pb-24 text-ink sm:pt-56 sm:pb-32">
      {/* Curve hangs 160px into the section (-top-40 + h-80); top padding keeps the copy clear of it. */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[140%] -translate-x-1/2 rounded-[50%] bg-royal-800" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow>Kit Finder</Eyebrow>
          <h3 className="mt-5 text-4xl leading-[0.95] font-semibold text-royal-900 sm:text-5xl">
            Find your school&apos;s official kit &amp; uniform.
          </h3>
          <p className="mt-4 max-w-md text-sm text-ink/65">
            Pick your school and class — we&apos;ll assemble the authorized course books, uniform and essentials.
            Untick anything you already have.
          </p>

          <p className="mt-10 mb-3 text-[11px] tracking-[.2em] uppercase opacity-60">1 · Select school</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SCHOOLS.map((s) => {
              const active = s === school;
              return (
                <button
                  key={s}
                  onClick={() => pickSchool(s)}
                  className={`ks-school group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${active ? "border-royal-800 bg-royal-800 text-white shadow-lg" : "border-ink/10 bg-white hover:border-royal-600"}`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${active ? "bg-gold-400 text-royal-900" : "bg-royal-50 text-royal-700 group-hover:bg-royal-100"}`}>
                    <SchoolIcon size={17} />
                  </span>
                  <span className="text-sm font-medium">{s}</span>
                  {s === "The City School" && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[9px] tracking-wider uppercase ${active ? "bg-gold-400 text-royal-900" : "bg-gold-100 text-gold-700"}`}>
                      Authorized
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-8 mb-3 text-[11px] tracking-[.2em] uppercase opacity-60">2 · Select class</p>
          <div className="flex flex-wrap gap-2">
            {SCHOOL_LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => pickLevel(l)}
                className={`rounded-full px-5 py-2.5 text-sm transition ${l === level ? "bg-gold-400 text-royal-900" : "bg-white ring-1 ring-ink/10 hover:ring-royal-600"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="ks-receipt relative rounded-[32px] bg-white p-6 shadow-[0_40px_100px_-40px_rgba(0,34,122,.45)] ring-1 ring-ink/5 sm:p-8">
            <div className="absolute -top-3 left-8 right-8 h-6 bg-[radial-gradient(circle_at_10px_0,transparent_9px,#fff_10px)] bg-[length:20px_20px]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[.25em] uppercase opacity-50">Official kit</p>
                <p className="font-heading text-2xl font-semibold text-royal-900">{school}</p>
                <p className="text-sm text-ink/60">{level}</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-royal-800 px-3 py-1.5 text-[11px] text-white">
                <ShieldCheck size={13} className="text-gold-400" /> Verified list
              </span>
            </div>

            <ul key={`${school}-${level}`} className="mt-6 divide-y divide-dashed divide-ink/10">
              {kit.map((k, i) => {
                const Icon = k.icon;
                const on = !excluded.includes(k.id);
                return (
                  <li key={k.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <button onClick={() => toggle(k.id)} className="flex w-full items-center gap-4 py-3.5 text-left">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition ${on ? "border-royal-700 bg-royal-700 text-white" : "border-ink/20"}`}>
                        {on && <Check size={14} />}
                      </span>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-700">
                        <Icon size={18} />
                      </span>
                      <span className={`flex-1 text-sm ${on ? "" : "line-through opacity-40"}`}>{k.name}</span>
                      <span className={`font-heading font-medium tabular-nums ${on ? "" : "opacity-40"}`}>{formatPrice(k.price)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-end justify-between border-t-2 border-ink pt-5">
              <div>
                <p className="text-[11px] tracking-[.2em] uppercase opacity-50">{chosen.length} items</p>
                <p className="font-heading text-4xl font-semibold text-royal-900 tabular-nums">{formatPrice(total)}</p>
              </div>
              <MagneticButton onClick={addKit} variant="gold" disabled={chosen.length === 0}>
                <ShoppingBag size={16} /> Add kit
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
