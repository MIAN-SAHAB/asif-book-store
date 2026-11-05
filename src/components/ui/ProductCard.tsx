"use client";

import { useRef, useState } from "react";
import { Check, Plus, ShieldCheck } from "lucide-react";
import type { Badge, Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/CartContext";
import ProductAvatar from "./ProductAvatar";
import Stars from "./Stars";
import TiltCard from "./TiltCard";

export const BADGE_STYLES: Record<Badge, string> = {
  "Best Seller": "bg-gold-400 text-royal-900",
  Authorized: "bg-royal-700 text-white",
  New: "bg-emerald-500 text-white",
  Limited: "bg-ink text-gold-300 ring-1 ring-gold-400/60",
};

type Variant = "light" | "dark" | "lux";

const SURFACE: Record<Variant, string> = {
  light: "bg-white text-ink ring-1 ring-ink/5 shadow-[0_20px_60px_-30px_rgba(0,34,122,.35)]",
  dark: "bg-white/[.04] text-white ring-1 ring-white/10",
  lux: "bg-gradient-to-b from-royal-900/90 to-ink text-white ring-1 ring-gold-400/25 shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]",
};

export function AddToCartButton({
  product,
  variant = "light",
  label = false,
}: {
  product: Product;
  variant?: Variant;
  label?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const onClick = () => {
    add(product);
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1400);
  };

  const base =
    variant === "light"
      ? "bg-royal-800 text-white hover:bg-gold-400 hover:text-royal-900"
      : "bg-gold-400 text-royal-900 hover:bg-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${product.name} to cart`}
      className={`relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full transition-all duration-300 active:scale-95 ${label ? "px-5 text-sm" : "w-11"} ${base}`}
    >
      {added ? <Check size={18} className="animate-bump" /> : <Plus size={18} />}
      {label && <span className="font-heading">{added ? "Added" : "Add to cart"}</span>}
    </button>
  );
}

export default function ProductCard({
  product,
  variant = "light",
  className = "",
}: {
  product: Product;
  variant?: Variant;
  className?: string;
}) {
  return (
    <TiltCard className={`group h-full rounded-[28px] p-3 ${SURFACE[variant]} ${className}`} max={7}>
      <div className="relative [transform-style:preserve-3d]">
        <ProductAvatar product={product} />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-heading font-medium tracking-wide uppercase [transform:translateZ(50px)] ${BADGE_STYLES[product.badge]}`}
          >
            {product.badge === "Authorized" && <ShieldCheck size={12} />}
            {product.badge}
          </span>
        )}
        {product.specs && (
          <div className="absolute inset-x-3 bottom-3 z-10 flex translate-y-3 flex-wrap gap-1.5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {product.specs.map((s) => (
              <span key={s} className="glass-dark rounded-full px-2.5 py-1 text-[10px] text-white">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 px-2 pt-4 pb-2">
        <p className="text-[11px] tracking-[.18em] uppercase opacity-60">{product.school ?? product.sub}</p>
        <h3 className="line-clamp-2 min-h-[2.6em] text-[17px] leading-tight font-medium">{product.name}</h3>
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            {product.compareAt && (
              <span className="text-xs line-through opacity-45">{formatPrice(product.compareAt)}</span>
            )}
            <span className="font-heading text-xl font-semibold">{formatPrice(product.price)}</span>
          </div>
          <AddToCartButton product={product} variant={variant} />
        </div>
      </div>
    </TiltCard>
  );
}
