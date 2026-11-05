"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRight, BookOpen, Cpu, Shirt, Watch, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { dialTicks, gearPath } from "@/lib/format";

interface Slide {
  id: string;
  index: string;
  kicker: string;
  title: string;
  word: string;
  copy: string;
  href: string;
  icon: LucideIcon;
  surface: string;
  accent: string;
  stroke: string;
  art: ReactNode;
}

const drawProps = (stroke: string, width = 2) => ({
  className: "story-path",
  fill: "none",
  stroke,
  strokeWidth: width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
  strokeDasharray: "1",
  strokeDashoffset: "1",
});

function BooksArt({ c }: { c: string }) {
  return (
    <>
      <path {...drawProps(c)} d="M300 470 C 240 430, 150 430, 90 460 L90 190 C150 160, 240 160, 300 200 Z" />
      <path {...drawProps(c)} d="M300 470 C 360 430, 450 430, 510 460 L510 190 C450 160, 360 160, 300 200 Z" />
      {[230, 270, 310, 350, 390].map((y) => (
        <path key={`l${y}`} {...drawProps(c, 1)} d={`M130 ${y} C 180 ${y - 18}, 230 ${y - 14}, 270 ${y + 4}`} />
      ))}
      {[230, 270, 310, 350, 390].map((y) => (
        <path key={`r${y}`} {...drawProps(c, 1)} d={`M330 ${y + 4} C 370 ${y - 14}, 420 ${y - 18}, 470 ${y}`} />
      ))}
      <path {...drawProps(c)} d="M440 160 L440 260 L460 240 L480 260 L480 150" />
      <circle {...drawProps(c, 1)} cx="300" cy="300" r="270" />
    </>
  );
}

function ShirtArt({ c }: { c: string }) {
  return (
    <>
      <path
        {...drawProps(c)}
        d="M220 110 L260 90 C 280 120, 320 120, 340 90 L380 110 L480 180 L440 260 L400 235 L400 500 L200 500 L200 235 L160 260 L120 180 Z"
      />
      <path {...drawProps(c)} d="M260 90 L300 160 L340 90" />
      <path {...drawProps(c)} d="M300 160 L285 200 L300 330 L315 200 Z" />
      {[230, 290, 350, 410, 460].map((y) => (
        <circle key={y} {...drawProps(c, 1)} cx="330" cy={y} r="5" />
      ))}
      <path {...drawProps(c, 1)} d="M240 270 L280 270 L280 300 C 270 310, 250 310, 240 300 Z" />
      <path {...drawProps(c, 1)} d="M60 60 L540 60 M60 540 L540 540" />
    </>
  );
}

function CircuitArt({ c }: { c: string }) {
  const traces = [
    "M60 120 L180 120 L220 160 L220 240",
    "M540 120 L420 120 L380 160 L380 240",
    "M60 480 L180 480 L220 440 L220 360",
    "M540 480 L420 480 L380 440 L380 360",
    "M300 40 L300 220",
    "M300 380 L300 560",
    "M40 300 L220 300",
    "M380 300 L560 300",
    "M100 220 L160 220 L180 260",
    "M500 380 L440 380 L420 340",
  ];
  return (
    <>
      <rect {...drawProps(c)} x="220" y="220" width="160" height="160" rx="18" />
      <rect {...drawProps(c, 1)} x="250" y="250" width="100" height="100" rx="8" />
      {traces.map((d) => (
        <path key={d} {...drawProps(c)} d={d} />
      ))}
      {[
        [60, 120], [540, 120], [60, 480], [540, 480], [300, 40], [300, 560], [40, 300], [560, 300], [100, 220], [500, 380],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} {...drawProps(c)} cx={x} cy={y} r="8" />
      ))}
    </>
  );
}

function WatchArt({ c }: { c: string }) {
  return (
    <>
      <circle {...drawProps(c)} cx="300" cy="300" r="230" />
      <circle {...drawProps(c, 1)} cx="300" cy="300" r="205" />
      <path {...drawProps(c)} d={dialTicks(300, 300, 200, 60)} />
      <path {...drawProps(c, 1)} d={gearPath(220, 360, 70, 58, 18)} />
      <path {...drawProps(c, 1)} d={gearPath(370, 220, 55, 45, 14)} />
      <path {...drawProps(c)} d="M300 300 L300 150 M300 300 L400 340" />
      <circle {...drawProps(c)} cx="300" cy="300" r="10" />
    </>
  );
}

const SLIDES: Slide[] = [
  {
    id: "s-books",
    index: "01",
    kicker: "The Reading Room",
    title: "Books that build futures.",
    word: "READ",
    copy: "Authorized course books for every class, bestselling fiction, MDCAT / ECAT prep and premium stationery — 25,000+ titles in stock.",
    href: "#books",
    icon: BookOpen,
    surface: "bg-cream text-royal-900",
    accent: "text-royal-600",
    stroke: "#0050d8",
    art: <BooksArt c="#0050d8" />,
  },
  {
    id: "s-uniforms",
    index: "02",
    kicker: "The Uniform Hub",
    title: "Crisp, official, perfectly sized.",
    word: "WEAR",
    copy: "School-approved fabrics, embroidered crests and a size guide that fits growing kids — for The City School, Beaconhouse, LGS and more.",
    href: "#uniforms",
    icon: Shirt,
    surface: "bg-royal-700 text-white",
    accent: "text-gold-400",
    stroke: "#ffd21f",
    art: <ShirtArt c="#ffd21f" />,
  },
  {
    id: "s-gadgets",
    index: "03",
    kicker: "The Tech Zone",
    title: "Smart gear for smarter study.",
    word: "PLUG",
    copy: "Exam-approved calculators, learning tablets, earbuds and power — tested, warrantied and set up in-store.",
    href: "#gadgets",
    icon: Cpu,
    surface: "bg-ink text-white",
    accent: "text-royal-300",
    stroke: "#3f7bf5",
    art: <CircuitArt c="#3f7bf5" />,
  },
  {
    id: "s-watches",
    index: "04",
    kicker: "The Watch Gallery",
    title: "Time, beautifully kept.",
    word: "TIME",
    copy: "From first digital watches to heirloom automatics — gift-boxed timepieces with genuine warranties.",
    href: "#watches",
    icon: Watch,
    surface: "bg-gradient-to-br from-royal-950 via-royal-900 to-black text-white",
    accent: "text-gold-400",
    stroke: "#f5b800",
    art: <WatchArt c="#f5b800" />,
  },
];

/** Section 5 — 400vh parent with a sticky 100vh stage cycling 4 absolute slides. */
export default function CategoryStory() {
  const root = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".story-slide");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const i = Math.min(SLIDES.length - 1, Math.floor(self.progress * SLIDES.length));
            if (counter.current) counter.current.textContent = SLIDES[i].index;
          },
        },
      });

      // Slide 1 draws in as the section arrives.
      tl.to(slides[0].querySelectorAll(".story-path"), { strokeDashoffset: 0, stagger: 0.02, duration: 0.8 }, 0)
        .fromTo(slides[0].querySelector(".story-word"), { xPercent: 20 }, { xPercent: -20, duration: 1 }, 0);

      for (let i = 1; i < slides.length; i++) {
        const prev = slides[i - 1];
        const cur = slides[i];
        const at = i;
        tl.fromTo(
          cur,
          { clipPath: "circle(0% at 70% 50%)" },
          { clipPath: "circle(150% at 70% 50%)", duration: 0.7, ease: "power1.inOut" },
          at - 0.15,
        )
          .to(prev.querySelector(".story-content"), { yPercent: -25, autoAlpha: 0, duration: 0.4 }, at - 0.15)
          .to(prev.querySelector(".story-art"), { scale: 0.8, rotate: -15, autoAlpha: 0, duration: 0.5 }, at - 0.15)
          .from(cur.querySelectorAll(".story-reveal"), { y: 90, autoAlpha: 0, stagger: 0.06, duration: 0.4 }, at + 0.15)
          .to(cur.querySelectorAll(".story-path"), { strokeDashoffset: 0, stagger: 0.015, duration: 0.7 }, at + 0.05)
          .fromTo(cur.querySelector(".story-art"), { rotate: 25, scale: 1.2 }, { rotate: 0, scale: 1, duration: 0.8 }, at - 0.1)
          .fromTo(cur.querySelector(".story-word"), { xPercent: 30 }, { xPercent: -20, duration: 1 }, at - 0.15);
      }
      tl.to(".story-bar", { scaleY: 1, duration: tl.duration() }, 0);
      tl.to({}, { duration: 0.2 });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Shop by category" className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {SLIDES.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`story-slide absolute inset-0 ${s.surface}`}
              style={{ zIndex: i + 1, clipPath: i === 0 ? undefined : "circle(0% at 70% 50%)" }}
            >
              <span
                aria-hidden
                className="story-word pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 font-heading text-[42vw] leading-none font-bold whitespace-nowrap opacity-[.045]"
              >
                {s.word}
              </span>

              <div className="story-art absolute top-1/2 right-[-25%] aspect-square w-[110vw] -translate-y-1/2 opacity-70 sm:right-[-8%] sm:w-[62vw] lg:w-[min(52vw,760px)] lg:opacity-100">
                <svg viewBox="0 0 600 600" className="h-full w-full" aria-hidden>
                  {s.art}
                </svg>
              </div>

              <div className="story-content relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
                <div className="max-w-xl">
                  <p className={`story-reveal flex items-center gap-3 text-[11px] tracking-[.3em] uppercase ${s.accent}`}>
                    <Icon size={16} /> {s.kicker}
                  </p>
                  <h2 className="story-reveal mt-6 text-5xl leading-[0.92] font-semibold sm:text-7xl lg:text-8xl">{s.title}</h2>
                  <p className="story-reveal mt-6 max-w-md text-sm leading-relaxed opacity-75 sm:text-base">{s.copy}</p>
                  <a
                    href={s.href}
                    className={`story-reveal group mt-10 inline-flex items-center gap-3 border-b border-current pb-1 font-heading text-lg ${s.accent}`}
                  >
                    Explore {s.word.toLowerCase()}
                    <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-2" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* Progress HUD */}
        <div className="pointer-events-none absolute top-1/2 left-3 z-20 flex -translate-y-1/2 flex-col items-center gap-4 mix-blend-difference sm:left-6">
          <span ref={counter} className="font-heading text-sm text-white tabular-nums">
            01
          </span>
          <div className="h-40 w-px bg-white/25">
            <div className="story-bar h-full w-full origin-top scale-y-0 bg-white" />
          </div>
          <span className="font-heading text-sm text-white/60">04</span>
        </div>
      </div>
    </section>
  );
}
