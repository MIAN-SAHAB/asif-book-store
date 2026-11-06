"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles, Star } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CATEGORY_META, type Category } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import MagneticButton from "@/components/ui/MagneticButton";
import { TONE_CLASSES } from "@/components/ui/ProductAvatar";
import { PRELOADER_REVEAL_DELAY } from "@/components/sections/Preloader";
import DotField from "@/components/ui/DotField";

const LINES = [
  { text: "Everything", className: "" },
  { text: "School Needs,", className: "text-royal-700" },
  { text: "One Roof.", className: "text-stroke text-royal-900" },
];

const FLOATERS: {
  cat: Category;
  pos: string;
  depth: number;
  rot: number;
  tone: keyof typeof TONE_CLASSES;
}[] = [
    { cat: "books", pos: "left-[-4%] top-[6%]", depth: 0.9, rot: -10, tone: "royal" },
    { cat: "uniforms", pos: "right-[-2%] top-[2%]", depth: 0.5, rot: 9, tone: "gold" },
    { cat: "gadgets", pos: "left-[-8%] bottom-[8%]", depth: 0.7, rot: 7, tone: "ink" },
    { cat: "watches", pos: "right-[-6%] bottom-[2%]", depth: 1.1, rot: -8, tone: "plum" },
  ];

const RING_TEXT = "AUTHORIZED DEALER • THE CITY SCHOOL • BOOKS • UNIFORMS • GADGETS • WATCHES • ";

/** Section 3 — Hero: load-animated after the preloader, then scroll-scrubbed parallax out. */
export default function Hero({ loaded }: { loaded: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!loaded) {
        gsap.set(".hero-char", { yPercent: 115, rotate: 6 });
        gsap.set([".hero-fade", ".hero-card"], { autoAlpha: 0 });
        gsap.set(".hero-logo", { scale: 0.4, autoAlpha: 0, rotate: -40 });
        return;
      }

      // Wait for the preloader curtains to open so the intro plays in view.
      const tl = gsap.timeline({ delay: PRELOADER_REVEAL_DELAY, defaults: { ease: "expo.out" } });
      tl.to(".hero-line", { strokeDashoffset: 0, autoRound: false, duration: 2.2, ease: "power2.inOut" }, 0)
        .to(".hero-char", { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.025 }, 0.1)
        .to(".hero-logo", { scale: 1, autoAlpha: 1, rotate: 0, duration: 1.6 }, 0.3)
        .fromTo(
          ".hero-card",
          { autoAlpha: 0, scale: 0.4, y: 120, rotateY: -60 },
          { autoAlpha: 1, scale: 1, y: 0, rotateY: 0, duration: 1.4, stagger: 0.12 },
          0.5,
        )
        .fromTo(".hero-fade", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.7)
        .add(() => {
          // Gentle ambient bob once landed.
          gsap.utils.toArray<HTMLElement>(".hero-card").forEach((el, i) => {
            gsap.to(el, { y: i % 2 ? 14 : -14, duration: 2.6 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" });
          });
        });

      // ---- Scroll-scrubbed exit ----
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-copy", { yPercent: -35, autoAlpha: 0.2, ease: "none", scrollTrigger: st });
      gsap.to(".hero-stage", { yPercent: 18, scale: 0.88, ease: "none", scrollTrigger: st });
      gsap.to(".hero-ring", { rotate: 220, ease: "none", scrollTrigger: st });
      gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el) => {
        const d = Number(el.dataset.depth ?? 1);
        gsap.to(el, { yPercent: -120 * d, ease: "none", scrollTrigger: st });
      });
      gsap.to(".hero-grid", { yPercent: 25, ease: "none", scrollTrigger: st });
    },
    { dependencies: [loaded], scope: root },
  );

  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const section = e.currentTarget;
    const r = section.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    gsap.utils.selector(section)(".hero-mouse").forEach((el: HTMLElement) => {
      const d = Number(el.dataset.depth ?? 1);
      gsap.to(el, { x: nx * 60 * d, y: ny * 50 * d, rotateY: nx * 18, rotateX: -ny * 18, duration: 1, ease: "power3.out", overwrite: "auto" });
    });
  };

  return (
    <section
      id="top"
      ref={root}
      onMouseMove={onMouseMove}
      className="relative isolate min-h-[100svh] overflow-hidden bg-cream pt-32 pb-20 lg:pt-36"
    >
      {/* Interactive dot-paper background: ripples in on load, reacts to the cursor, clicks send a wave. */}
      <div className="hero-grid absolute inset-0 -z-10">
        <DotField active={loaded} delay={PRELOADER_REVEAL_DELAY} />
      </div>

      {/* Gold accent stroke that draws in */}
      <svg
        className="hero-grid pointer-events-none absolute inset-0 -z-10 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          className="hero-line"
          d="M-20 760 C 300 620, 520 880, 820 700 S 1300 520, 1480 640"
          fill="none"
          stroke="#ffd21f"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </svg>
      <div className="absolute top-[-20%] right-[-10%] -z-10 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(10,91,224,.18),transparent_60%)]" />
      <div className="absolute bottom-[-30%] left-[-15%] -z-10 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(255,210,31,.28),transparent_60%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-12">
        {/* Copy */}
        <div className="hero-copy lg:col-span-7">
          <div className="hero-fade mb-8 inline-flex items-center gap-2 rounded-full bg-royal-800 py-1.5 pr-4 pl-1.5 text-[12px] text-white">
            <span className="flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-royal-900">
              <ShieldCheck size={13} /> Authorized
            </span>
            Dealer for The City School &amp; 40+ schools
          </div>

          <h1 className="text-[13.5vw] leading-[0.88] font-semibold tracking-[-0.045em] text-royal-900 sm:text-[12vw] lg:text-[7.4vw] 2xl:text-[124px]">
            {LINES.map((line) => (
              <span key={line.text} className={`block overflow-hidden pb-[0.06em] ${line.className}`}>
                {line.text.split(" ").map((word, wi) => (
                  <span key={wi} className="inline-block whitespace-nowrap">
                    {wi > 0 && <span className="hero-char inline-block">&nbsp;</span>}
                    {word.split("").map((c, i) => (
                      <span key={i} className="hero-char inline-block">
                        {c}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="hero-fade mt-8 max-w-xl text-[15px] leading-relaxed text-ink/70 sm:text-base">
            Pakistan&apos;s family mega-mart for course books, official school uniforms, study gadgets and
            timeless watches — sorted by school, class and size so back-to-school takes one trip, not ten.
          </p>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#books" variant="royal">
              Shop the Store <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="#schools" variant="outline">
              <Sparkles size={16} className="text-gold-600" /> Find Your School Kit
            </MagneticButton>
          </div>

          <div className="hero-fade mt-12 flex flex-wrap items-center gap-8">
            <div className="flex -space-x-3">
              {(["royal", "gold", "mint", "plum"] as const).map((t) => (
                <span key={t} className={`h-10 w-10 rounded-full bg-gradient-to-br ring-2 ring-cream ${TONE_CLASSES[t]}`} />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
                <span className="ml-1 font-heading text-sm text-ink">4.9</span>
              </div>
              <p className="text-xs text-ink/60">Trusted by 85,000+ families</p>
            </div>
          </div>

          {/* Mobile category chips */}
          <div className="hero-fade mt-10 grid grid-cols-2 gap-3 lg:hidden">
            {(Object.keys(CATEGORY_META) as Category[]).map((c, i) => {
              const Icon = CATEGORY_META[c].icon;
              return (
                <a
                  key={c}
                  href={`#${c}`}
                  className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br p-4 ${TONE_CLASSES[FLOATERS[i].tone]}`}
                >
                  <Icon size={22} />
                  <span className="font-heading text-sm font-medium">{CATEGORY_META[c].label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Stage: logo + rotating ring + floating 3D cards */}
        <div className="hero-stage relative hidden h-[600px] [perspective:1200px] lg:col-span-5 lg:block">
          <div className="absolute inset-0 m-auto h-[380px] w-[380px]">
            <svg viewBox="0 0 400 400" className="hero-ring absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]" aria-hidden>
              <defs>
                <path id="hero-ring-path" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
              </defs>
              <circle cx="200" cy="200" r="190" fill="none" stroke="#00227a" strokeOpacity=".12" strokeDasharray="2 6" />
              <text className="fill-royal-800 text-[15px] tracking-[.32em]">
                <textPath href="#hero-ring-path">{RING_TEXT}</textPath>
              </text>
            </svg>
            <div className="hero-logo absolute inset-8 overflow-hidden rounded-full shadow-[0_40px_100px_-20px_rgba(0,34,122,.6)] ring-8 ring-white">
              <Image src="/assets/images/logo.jpeg" alt="Asif Book Store" fill sizes="320px" priority className="object-cover" />
            </div>
          </div>

          {FLOATERS.map((f) => {
            const meta = CATEGORY_META[f.cat];
            const Icon = meta.icon;
            return (
              <div key={f.cat} data-depth={f.depth} className={`hero-float absolute ${f.pos}`}>
                <div data-depth={f.depth} className="hero-mouse [transform-style:preserve-3d]">
                  <a
                    href={`#${f.cat}`}
                    className={`hero-card group block w-48 rounded-3xl bg-gradient-to-br p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.45)] ring-1 ring-white/30 [transform-style:preserve-3d] ${TONE_CLASSES[f.tone]}`}
                    style={{ rotate: `${f.rot}deg` }}
                  >
                    <div className="flex items-start justify-between [transform:translateZ(30px)]">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                        <Icon size={24} />
                      </span>
                      <ArrowRight size={18} className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                    </div>
                    <p className="mt-6 font-heading text-2xl font-semibold [transform:translateZ(45px)]">{meta.label}</p>
                    <p className="text-[11px] opacity-75 [transform:translateZ(25px)]">from {formatPrice(meta.from)}</p>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <a
        href="#schools"
        className="hero-fade absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[.3em] text-royal-800/60 uppercase"
      >
        Scroll
        <span className="grid h-10 w-6 place-items-start justify-center rounded-full border border-royal-800/30 pt-1.5">
          <ArrowDown size={12} className="animate-bounce" />
        </span>
      </a>
    </section>
  );
}
