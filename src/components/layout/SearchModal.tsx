"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ALL_PRODUCTS, CATEGORY_META, type Category } from "@/lib/products";
import ProductAvatar from "@/components/ui/ProductAvatar";
import { AddToCartButton } from "@/components/ui/ProductCard";
import { formatPrice } from "@/lib/format";

const QUICK = ["MDCAT", "Blazer", "Calculator", "Chronograph", "Earbuds", "Notebook"];

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!q || `${p.name} ${p.sub} ${p.school ?? ""} ${p.category}`.toLowerCase().includes(q)),
    ).slice(0, 12);
  }, [query, cat]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-label="Search products">
      <div className="absolute inset-0 animate-[fade-up_.4s_ease_both] bg-royal-950/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative flex max-h-[78vh] w-full max-w-2xl animate-fade-up flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl">
        <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
          <Search className="text-royal-700" size={20} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, uniforms, gadgets, watches…"
            className="flex-1 bg-transparent font-heading text-lg outline-none placeholder:text-ink/35"
          />
          <button onClick={onClose} className="rounded-full p-2 hover:bg-ink/5" aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-ink/10 px-5 py-3">
          {(["all", "books", "uniforms", "gadgets", "watches"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs tracking-wider uppercase transition ${cat === c ? "bg-royal-800 text-white" : "bg-ink/5 hover:bg-ink/10"}`}
            >
              {c === "all" ? "All" : CATEGORY_META[c].label}
            </button>
          ))}
        </div>
        {!query && (
          <div className="flex flex-wrap items-center gap-2 px-5 pt-4 text-xs">
            <span className="opacity-50">Trending:</span>
            {QUICK.map((q) => (
              <button key={q} onClick={() => setQuery(q)} className="rounded-full border border-ink/10 px-3 py-1 hover:border-royal-600 hover:text-royal-700">
                {q}
              </button>
            ))}
          </div>
        )}
        <ul className="flex-1 overflow-y-auto p-3">
          {results.length === 0 && <li className="p-8 text-center text-sm opacity-60">No products match “{query}”.</li>}
          {results.map((p) => (
            <li key={p.id} className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-white">
              <ProductAvatar product={p} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-[11px] tracking-wider uppercase opacity-50">
                  {CATEGORY_META[p.category].label} · {p.school ?? p.sub}
                </p>
              </div>
              <span className="hidden font-heading font-semibold sm:block">{formatPrice(p.price)}</span>
              <AddToCartButton product={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
