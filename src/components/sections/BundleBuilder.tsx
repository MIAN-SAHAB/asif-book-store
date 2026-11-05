"use client";

import { useRef, useState } from "react";
import { Check, Gift, Percent, ShoppingBag } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { BUNDLE_OPTIONS, BUNDLE_TIERS, CATEGORY_META, type Category, type Product } from "@/lib/products";
import { formatPrice, gearPath } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";
import Eyebrow from "@/components/ui/Eyebrow";
import MagneticButton from "@/components/ui/MagneticButton";
import ProductAvatar from "@/components/ui/ProductAvatar";

const STEPS: Category[] = ["books", "uniforms", "gadgets", "watches"];

/** Section 11 — pick one item per category, watch the bundle discount grow, add all to cart. */
export default function BundleBuilder() {
  const root = useRef<HTMLElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const shown = useRef({ v: 0 });
  const [picks, setPicks] = useState<Partial<Record<Category, Product>>>({});
  const { addMany } = useCart();

  const chosen = STEPS.map((c) => picks[c]).filter((p): p is Product => Boolean(p));
  const subtotal = chosen.reduce((n, p) => n + p.price, 0);
  const rate = chosen.length ? BUNDLE_TIERS[chosen.length - 1] : 0;
  const savings = subtotal * rate;
  const total = subtotal - savings;

  useGSAP(
    () => {
      gsap.to(".bb-ribbon", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 80%", scrub: 0.8 },
      });
      gsap.to(".bb-gear", {
        rotation: 360,
        svgOrigin: "100 100",
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".bb-step").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 80, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: `top ${98 - i * 2}%`, end: "top 70%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  // Animate the displayed total whenever the selection changes (UI feedback, not page motion).
  useGSAP(
    () => {
      gsap.to(shown.current, {
        v: total,
        duration: 0.8,
        ease: "power3.out",
        onUpdate: () => {
          if (totalRef.current) totalRef.current.textContent = formatPrice(shown.current.v);
        },
      });
    },
    { dependencies: [total], scope: root },
  );

  const pick = (c: Category, p: Product) =>
    setPicks((prev) => ({ ...prev, [c]: prev[c]?.id === p.id ? undefined : p }));

  const addBundle = () => {
    const items: Product[] = chosen.map((p) => ({
      ...p,
      id: `${p.id}-bundle`,
      name: `${p.name} (Bundle −${Math.round(rate * 100)}%)`,
      price: Math.round(p.price * (1 - rate)),
      compareAt: p.price,
    }));
    addMany(items, `Mega Bundle added — you saved ${formatPrice(savings)}`);
    setPicks({});
  };

  return (
    <section id="bundle" ref={root} className="relative overflow-hidden bg-paper py-28 sm:py-36">
      <svg viewBox="0 0 200 200" className="bb-gear-wrap pointer-events-none absolute -top-24 -right-24 h-96 w-96 opacity-[.08]" aria-hidden>
        <g className="bb-gear">
          <path d={gearPath(100, 100, 95, 80, 20)} fill="#00227a" />
          <circle cx="100" cy="100" r="30" fill="#f4efe2" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>Back-to-School Mega Bundle</Eyebrow>
            <h2 className="mt-6 text-5xl leading-[0.9] font-semibold text-royal-900 sm:text-7xl">
              Build your bundle.
              <br />
              <span className="text-gold-600">Save up to 15%.</span>
            </h2>
          </div>
          <div className="flex gap-2">
            {BUNDLE_TIERS.map((t, i) => (
              <div
                key={t}
                className={`rounded-2xl px-4 py-3 text-center transition-all duration-500 ${chosen.length > i ? "bg-royal-800 text-white" : "bg-white text-ink/50"}`}
              >
                <p className="font-heading text-lg font-semibold">{Math.round(t * 100)}%</p>
                <p className="text-[10px] tracking-wider uppercase">{i + 1} item{i ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            {/* Connecting ribbon down the steps */}
            <svg className="pointer-events-none absolute top-0 left-6 hidden h-full w-12 md:block" viewBox="0 0 48 1000" preserveAspectRatio="none" aria-hidden>
              <path
                className="bb-ribbon"
                d="M24 0 C 48 120, 0 240, 24 360 S 48 600, 24 720 S 0 900, 24 1000"
                fill="none"
                stroke="#f5b800"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </svg>

            <div className="flex flex-col gap-10">
              {STEPS.map((c, i) => {
                const Meta = CATEGORY_META[c];
                const Icon = Meta.icon;
                const sel = picks[c];
                return (
                  <div key={c} className="bb-step md:pl-24">
                    <div className="mb-4 flex items-center gap-3">
                      <span className={`relative z-10 grid h-12 w-12 place-items-center rounded-full transition-colors md:absolute md:left-6 ${sel ? "bg-royal-800 text-gold-400" : "bg-white text-royal-800 ring-1 ring-ink/10"}`}>
                        {sel ? <Check size={20} /> : <Icon size={20} />}
                      </span>
                      <div>
                        <p className="text-[10px] tracking-[.25em] text-ink/50 uppercase">Step {i + 1}</p>
                        <p className="font-heading text-2xl font-semibold text-royal-900">Pick a {Meta.label.replace(/s$/, "").toLowerCase()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                      {BUNDLE_OPTIONS[c].map((p) => {
                        const active = sel?.id === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => pick(c, p)}
                            aria-pressed={active}
                            className={`group relative flex flex-col gap-3 rounded-3xl p-2.5 text-left transition-all duration-300 ${active ? "-translate-y-1 bg-royal-800 text-white shadow-[0_20px_40px_-15px_rgba(0,34,122,.6)]" : "bg-white hover:-translate-y-1 hover:shadow-lg"}`}
                          >
                            <ProductAvatar product={p} className="aspect-[4/3]!" />
                            <span className="px-1.5 text-[13px] leading-tight font-medium">{p.name}</span>
                            <span className={`px-1.5 pb-1.5 font-heading font-semibold ${active ? "text-gold-300" : "text-royal-800"}`}>{formatPrice(p.price)}</span>
                            <span className={`absolute top-4 right-4 grid h-7 w-7 place-items-center rounded-full transition ${active ? "scale-100 bg-gold-400 text-royal-900" : "scale-0 bg-white"}`}>
                              <Check size={14} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <div className="rounded-[32px] bg-royal-900 p-7 text-white shadow-[0_40px_100px_-40px_rgba(0,0,0,.7)]">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-400 text-royal-900">
                  <Gift size={20} />
                </span>
                <div>
                  <p className="font-heading text-xl font-semibold">Your Mega Bundle</p>
                  <p className="text-xs opacity-60">{chosen.length} / 4 categories</p>
                </div>
              </div>

              <div className="mt-5 flex h-2 gap-1">
                {STEPS.map((c) => (
                  <span key={c} className={`flex-1 rounded-full transition-colors duration-500 ${picks[c] ? "bg-gold-400" : "bg-white/15"}`} />
                ))}
              </div>

              <ul className="mt-6 min-h-40 space-y-3">
                {chosen.length === 0 && <li className="py-8 text-center text-sm opacity-50">Pick items on the left to start.</li>}
                {chosen.map((p) => (
                  <li key={p.id} className="flex animate-fade-up items-center gap-3">
                    <ProductAvatar product={p} size="sm" className="h-11! w-11! rounded-xl!" />
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span className="text-sm opacity-80">{formatPrice(p.price)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between opacity-70">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gold-300">
                  <span className="flex items-center gap-1.5">
                    <Percent size={14} /> Bundle discount ({Math.round(rate * 100)}%)
                  </span>
                  <span>−{formatPrice(savings)}</span>
                </div>
                <div className="flex items-end justify-between pt-3">
                  <span className="opacity-70">Total</span>
                  <span ref={totalRef} className="font-heading text-4xl font-semibold tabular-nums">
                    {formatPrice(0)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <MagneticButton onClick={addBundle} disabled={chosen.length === 0} variant="gold" className="w-full" fullWidth strength={0.2}>
                  <ShoppingBag size={16} /> Add bundle to cart
                </MagneticButton>
              </div>
              {chosen.length > 0 && chosen.length < 4 && (
                <p className="mt-3 text-center text-[11px] opacity-60">
                  Add {4 - chosen.length} more categor{4 - chosen.length === 1 ? "y" : "ies"} to unlock {Math.round(BUNDLE_TIERS[3] * 100)}% off
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
