"use client";

import { useEffect, useState } from "react";
import { Minus, PackageCheck, Plus, ShoppingBag, Trash, Truck, X } from "lucide-react";
import { FREE_DELIVERY_THRESHOLD, useCart } from "./CartContext";
import ProductAvatar from "@/components/ui/ProductAvatar";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotal, count, clear, toast } = useCart();
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_DELIVERY_THRESHOLD);
  const delivery = subtotal === 0 || remaining === 0 ? 0 : 250;

  const checkout = () => {
    setPlaced(true);
    clear();
  };

  const onClose = () => {
    close();
    setPlaced(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-label="Shopping cart"
          className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-700 ease-[var(--ease-expo)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-royal-700" />
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <span className="rounded-full bg-royal-800 px-2.5 py-0.5 text-xs text-white">{count}</span>
            </div>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 transition hover:rotate-90 hover:bg-ink hover:text-white"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </header>

          {lines.length > 0 && (
            <div className="border-b border-ink/10 px-6 py-4">
              <div className="mb-2 flex items-center gap-2 text-xs">
                <Truck size={14} className="text-royal-700" />
                {remaining > 0 ? (
                  <span>
                    Add <b>{formatPrice(remaining)}</b> more for free delivery
                  </span>
                ) : (
                  <span className="text-emerald-700">You&apos;ve unlocked free delivery!</span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full origin-left rounded-full bg-gradient-to-r from-royal-600 to-gold-400 transition-transform duration-700"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {placed ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <PackageCheck size={56} className="text-emerald-600" />
                <h3 className="text-2xl font-semibold">Order placed (demo)</h3>
                <p className="max-w-xs text-sm opacity-70">
                  This is a front-end prototype — no payment was taken. Hook the checkout up to your store backend
                  to go live.
                </p>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-royal-50">
                  <ShoppingBag size={40} className="text-royal-600" />
                </div>
                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-sm opacity-70">Books, blazers, gadgets and watches are waiting.</p>
                <button
                  onClick={onClose}
                  className="mt-2 rounded-full bg-royal-800 px-6 py-3 text-sm text-white hover:bg-royal-700"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {lines.map(({ product, qty }) => (
                  <li key={product.id} className="flex animate-fade-up gap-4 rounded-2xl bg-white p-3 ring-1 ring-ink/5">
                    <ProductAvatar product={product} size="sm" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-[11px] tracking-wider uppercase opacity-50">{product.school ?? product.sub}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/10">
                          <button
                            onClick={() => setQty(product.id, qty - 1)}
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/5"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
                          <button
                            onClick={() => setQty(product.id, qty + 1)}
                            className="grid h-8 w-8 place-items-center rounded-full hover:bg-ink/5"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-heading font-semibold">{formatPrice(product.price * qty)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      className="self-start rounded-full p-2 text-ink/40 hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 && !placed && (
            <footer className="space-y-3 border-t border-ink/10 bg-white px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Delivery</span>
                <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 font-heading text-xl font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal + delivery)}</span>
              </div>
              <button
                onClick={checkout}
                className="w-full rounded-full bg-gold-400 py-4 font-heading font-semibold text-royal-900 transition hover:bg-royal-800 hover:text-white"
              >
                Checkout
              </button>
            </footer>
          )}
        </aside>
      </div>

      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="flex animate-fade-up items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-2xl"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-400 text-royal-900">
              <ShoppingBag size={13} />
            </span>
            <span className="max-w-[70vw] truncate">{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
}
