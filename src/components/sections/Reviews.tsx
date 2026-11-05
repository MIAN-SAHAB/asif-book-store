"use client";

import { useRef } from "react";
import { Quote, Star } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { reviews, type Review } from "@/lib/products";
import Eyebrow from "@/components/ui/Eyebrow";

const ROW_A = [...reviews.slice(0, 4), ...reviews.slice(0, 4)];
const ROW_B = [...reviews.slice(4), ...reviews.slice(4)];

function ReviewCard({ r, dark }: { r: Review; dark?: boolean }) {
  const Icon = r.icon;
  return (
    <figure
      className={`flex w-[320px] shrink-0 flex-col gap-5 rounded-[28px] p-7 sm:w-[400px] ${dark ? "bg-royal-800 text-white" : "bg-white text-ink ring-1 ring-ink/5"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-gold-500">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={15} className={i < r.rating ? "fill-current" : "opacity-25"} />
          ))}
        </div>
        <Quote size={28} className={dark ? "text-gold-400" : "text-royal-200"} />
      </div>
      <blockquote className="text-[15px] leading-relaxed">“{r.text}”</blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-full ${dark ? "bg-gold-400 text-royal-900" : "bg-royal-800 text-gold-300"}`}>
          <Icon size={18} />
        </span>
        <span>
          <b className="block font-heading text-sm font-medium">{r.name}</b>
          <span className="text-xs opacity-60">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Section 12a — review rows that travel with scroll and skew with scroll velocity. */
export default function Reviews() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
      gsap.fromTo(".rv-row-a", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: st });
      gsap.fromTo(".rv-row-b", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: st });

      // Velocity-based skew
      const proxy = { skew: 0 };
      const setSkew = gsap.quickSetter(".rv-row", "skewX", "deg");
      const clamp = gsap.utils.clamp(-14, 14);
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -250);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.9,
              ease: "power3",
              overwrite: true,
              onUpdate: () => setSkew(proxy.skew),
            });
          }
        },
      });

      gsap.fromTo(
        ".rv-score",
        { scale: 0.6, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 40%", scrub: 0.6 } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Customer reviews" className="relative overflow-hidden bg-cream py-28 sm:py-36">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-end">
        <div>
          <Eyebrow>Loved by families</Eyebrow>
          <h2 className="mt-6 text-5xl leading-[0.9] font-semibold text-royal-900 sm:text-7xl">
            Every term,
            <br />
            <span className="text-royal-600">a five-star return.</span>
          </h2>
        </div>
        <div className="rv-score flex items-center gap-5 rounded-[28px] bg-royal-800 p-6 text-white">
          <span className="font-heading text-6xl font-semibold text-gold-400">4.9</span>
          <div>
            <div className="flex gap-0.5 text-gold-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} className="fill-current" />
              ))}
            </div>
            <p className="mt-1 text-xs opacity-70">
              Average from 12,000+ in-store
              <br />
              &amp; online reviews
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-5">
        <div className="rv-row rv-row-a flex w-max gap-5 pl-5">
          {ROW_A.map((r, i) => (
            <ReviewCard key={i} r={r} dark={i % 3 === 1} />
          ))}
        </div>
        <div className="rv-row rv-row-b flex w-max gap-5 pl-5">
          {ROW_B.map((r, i) => (
            <ReviewCard key={i} r={r} dark={i % 3 === 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
