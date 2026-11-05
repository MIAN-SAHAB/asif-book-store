"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, BookOpen, Brain, Feather, GraduationCap, PenTool, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BOOK_FILTERS, books, type BookFilter } from "@/lib/products";
import Eyebrow from "@/components/ui/Eyebrow";
import ProductCard from "@/components/ui/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const FILTER_META: Record<BookFilter, { icon: LucideIcon; note: string; tone: string }> = {
  All: { icon: BookOpen, note: "Entire shelf", tone: "from-royal-500 to-royal-900" },
  Academic: { icon: GraduationCap, note: "Course & text books", tone: "from-sky-300 to-royal-700" },
  Fiction: { icon: Feather, note: "Novels & stories", tone: "from-fuchsia-300 to-indigo-800" },
  "Competitive Exams": { icon: Brain, note: "MDCAT · ECAT · CSS", tone: "from-emerald-200 to-teal-700" },
  Stationeries: { icon: PenTool, note: "Pens, boxes, notebooks", tone: "from-gold-200 to-gold-600" },
};

const RIBBONS = [
  { left: "6%", h: 220, color: "#0050d8" },
  { left: "14%", h: 150, color: "#ffd21f" },
  { left: "82%", h: 260, color: "#e08a00" },
  { left: "90%", h: 180, color: "#00227a" },
];

const SPINES = Array.from({ length: 26 }, (_, i) => ({
  h: 55 + ((i * 37) % 45),
  w: 18 + ((i * 13) % 16),
  c: ["bg-royal-700", "bg-gold-400", "bg-royal-900", "bg-gold-600", "bg-royal-400", "bg-ink", "bg-gold-200"][i % 7],
}));

/** Section 6 — filterable book grid with scroll-drawn bookmark ribbons and a hover-reveal filter list. */
export default function BooksEmporium() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<BookFilter>("All");
  const [hovered, setHovered] = useState<BookFilter | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? books : books.filter((b) => b.sub === filter)),
    [filter],
  );

  useGSAP(
    () => {
      // Ribbons draw down + fill in as the section scrolls into view.
      gsap.utils.toArray<SVGPathElement>(".ribbon-path").forEach((p, i) => {
        gsap.fromTo(
          p,
          { strokeDashoffset: 1, fillOpacity: 0 },
          {
            strokeDashoffset: 0,
            fillOpacity: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: `top ${85 - i * 6}%`, end: "top 15%", scrub: 0.6 },
          },
        );
      });
      gsap.fromTo(
        ".books-title-line",
        { yPercent: 105 },
        {
          yPercent: 0,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: { trigger: ".books-title", start: "top 90%", end: "top 45%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        ".book-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: ".book-shelf", start: "top bottom", end: "bottom 70%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  const moveReveal = (e: MouseEvent<HTMLDivElement>) => {
    const list = e.currentTarget;
    const r = list.getBoundingClientRect();
    gsap.to(gsap.utils.selector(list)(".hover-reveal"), {
      x: e.clientX - r.left + 24,
      y: e.clientY - r.top - 70,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const HoverIcon = hovered ? FILTER_META[hovered].icon : BookOpen;

  return (
    <section id="books" ref={root} className="relative overflow-hidden bg-cream pt-28 pb-10 sm:pt-36">
      {/* Bookmark ribbons hanging from the top edge */}
      {RIBBONS.map((r, i) => (
        <svg
          key={i}
          aria-hidden
          className="pointer-events-none absolute top-0 hidden md:block"
          style={{ left: r.left }}
          width="40"
          height={r.h + 4}
          viewBox={`0 0 40 ${r.h + 4}`}
        >
          <path
            className="ribbon-path"
            d={`M2 0 L2 ${r.h} L20 ${r.h - 18} L38 ${r.h} L38 0`}
            fill={r.color}
            stroke={r.color}
            strokeWidth="3"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
      ))}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="books-title flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow>Books Emporium</Eyebrow>
            <h2 className="mt-6 text-5xl leading-[0.9] font-semibold text-royal-900 sm:text-7xl lg:text-8xl">
              <span className="block overflow-hidden">
                <span className="books-title-line block">A shelf for</span>
              </span>
              <span className="block overflow-hidden">
                <span className="books-title-line block text-royal-600">every chapter.</span>
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink/65">
            Course books stocked by class, exam guides updated every season, fiction for weekends and stationery for
            every desk. Filter the shelf below.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Filter list with cursor-following reveal */}
          <div
            onMouseMove={moveReveal}
            onMouseLeave={() => setHovered(null)}
            className="relative lg:sticky lg:top-28 lg:col-span-4 lg:self-start"
          >
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
              {BOOK_FILTERS.map((f, i) => {
                const active = f === filter;
                const count = f === "All" ? books.length : books.filter((b) => b.sub === f).length;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    onMouseEnter={() => setHovered(f)}
                    className={`group relative shrink-0 rounded-full border px-5 py-2.5 text-left transition-colors lg:flex lg:items-baseline lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:border-ink/10 lg:px-0 lg:py-5 ${active ? "border-royal-800 bg-royal-800 text-white lg:bg-transparent lg:text-royal-700" : "border-ink/10 text-ink/80 hover:text-royal-700"}`}
                  >
                    <span className="hidden font-heading text-xs opacity-50 lg:inline">0{i + 1}</span>
                    <span className="font-heading text-sm transition-transform duration-500 ease-[var(--ease-expo)] lg:text-3xl lg:group-hover:translate-x-3">
                      {f}
                    </span>
                    <span className="ml-auto hidden text-xs opacity-50 lg:inline">{count}</span>
                    {active && <span className="absolute bottom-[-1px] left-0 hidden h-[2px] w-full bg-royal-700 lg:block" />}
                  </button>
                );
              })}
            </div>

            <div
              className={`hover-reveal pointer-events-none absolute top-0 left-0 z-20 hidden h-36 w-32 rounded-2xl bg-gradient-to-br p-4 text-white shadow-2xl transition-[opacity,scale] duration-300 lg:block ${hovered ? `scale-100 opacity-100 ${FILTER_META[hovered].tone}` : "scale-50 opacity-0 from-royal-500 to-royal-900"}`}
            >
              <HoverIcon size={36} strokeWidth={1.4} />
              <p className="mt-6 text-[10px] leading-tight tracking-wider uppercase opacity-90">
                {hovered ? FILTER_META[hovered].note : ""}
              </p>
              <ArrowUpRight size={14} className="absolute top-3 right-3" />
            </div>

            <div className="mt-10 hidden rounded-3xl bg-royal-800 p-6 text-white lg:block">
              <p className="font-heading text-xl">Can&apos;t find a title?</p>
              <p className="mt-2 text-xs opacity-70">We source special orders within 3–5 days. Ask at the counter or search the full catalogue.</p>
            </div>
          </div>

          {/* Grid */}
          <div className="lg:col-span-8">
            <div key={filter} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <ScrollReveal key={p.id} y={80} rotate={i % 2 ? 2 : -2}>
                  <div className="h-full animate-fade-up" style={{ animationDelay: `${(i % 6) * 70}ms` }}>
                    <ProductCard product={p} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-growing book shelf */}
      <div className="book-shelf mx-auto mt-24 flex max-w-7xl items-end gap-1 overflow-hidden px-5 sm:px-8" aria-hidden>
        {SPINES.map((s, i) => (
          <span
            key={i}
            className={`book-spine block shrink-0 origin-bottom rounded-t-sm ${s.c}`}
            style={{ height: s.h, width: s.w }}
          />
        ))}
      </div>
      <div className="mx-auto h-3 max-w-7xl rounded-full bg-royal-900/90" />
    </section>
  );
}
