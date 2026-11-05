import type { CSSProperties } from "react";
import type { Category, Product, Tone } from "@/lib/products";

export const TONE_CLASSES: Record<Tone, string> = {
  royal: "from-royal-400 via-royal-600 to-royal-900 text-gold-300",
  gold: "from-gold-200 via-gold-400 to-gold-600 text-royal-800",
  ink: "from-[#1d2a5c] via-ink to-black text-gold-300",
  sky: "from-sky-200 via-royal-300 to-royal-600 text-white",
  ember: "from-amber-200 via-orange-400 to-rose-600 text-white",
  mint: "from-emerald-100 via-teal-400 to-teal-800 text-white",
  plum: "from-fuchsia-300 via-violet-500 to-indigo-900 text-white",
  cream: "from-gold-50 via-[#f7e9bd] to-gold-400 text-royal-800",
};

/** Category-specific surface pattern so each family reads differently at a glance. */
const PATTERNS: Record<Category, CSSProperties> = {
  books: {
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(255,255,255,.16) 0 1px, transparent 1px 18px), linear-gradient(90deg, rgba(255,80,80,.25) 0 1px, transparent 1px)",
    backgroundPosition: "0 0, 28px 0",
  },
  uniforms: {
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 6px, transparent 6px 18px), repeating-linear-gradient(-45deg, rgba(255,255,255,.08) 0 6px, transparent 6px 18px)",
  },
  gadgets: {
    backgroundImage: "radial-gradient(rgba(255,255,255,.28) 1px, transparent 1.5px)",
    backgroundSize: "14px 14px",
  },
  watches: {
    backgroundImage:
      "repeating-radial-gradient(circle at 50% 55%, rgba(255,255,255,.14) 0 1px, transparent 1px 16px)",
  },
};

interface ProductAvatarProps {
  product: Pick<Product, "icon" | "tone" | "category">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ProductAvatar({ product, size = "md", className = "" }: ProductAvatarProps) {
  const Icon = product.icon;
  const dims =
    size === "sm" ? "h-16 w-16 rounded-2xl" : size === "lg" ? "aspect-[4/5] rounded-[28px]" : "aspect-square rounded-[22px]";
  const iconSize = size === "sm" ? 26 : size === "lg" ? 96 : 72;

  return (
    <div
      className={`relative isolate overflow-hidden bg-gradient-to-br ${TONE_CLASSES[product.tone]} ${dims} ${className}`}
    >
      <div className="absolute inset-0 opacity-90" style={PATTERNS[product.category]} />
      {size !== "sm" && (
        <>
          <Icon
            aria-hidden
            className="absolute -right-6 -bottom-6 opacity-15 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-rotate-12 group-hover:scale-110"
            size={iconSize * 2.1}
            strokeWidth={1}
          />
          <span className="absolute top-1/2 left-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-2xl" />
          <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-current opacity-60" />
          <span className="absolute bottom-4 left-4 h-px w-10 bg-current opacity-50" />
        </>
      )}
      <div className="relative z-10 grid h-full w-full place-items-center [transform:translateZ(40px)]">
        <Icon
          aria-hidden
          size={iconSize}
          strokeWidth={1.4}
          className="drop-shadow-[0_12px_18px_rgba(0,0,0,.25)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:scale-110"
        />
      </div>
    </div>
  );
}
