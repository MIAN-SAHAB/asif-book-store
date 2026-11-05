"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useCart } from "@/components/cart/CartContext";
import SearchModal from "./SearchModal";

const LINKS = [
  { href: "#books", label: "Books" },
  { href: "#uniforms", label: "Uniforms" },
  { href: "#gadgets", label: "Gadgets" },
  { href: "#watches", label: "Watches" },
  { href: "#schools", label: "Schools" },
  { href: "#bundle", label: "Bundles" },
];

/** Section 2 — floating glass navbar with quick-jumps, search modal and live cart badge. */
export default function Navbar({ loaded }: { loaded: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { count, open, bumpKey } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      if (!loaded) {
        gsap.set(ref.current, { yPercent: -160, autoAlpha: 0 });
        return;
      }
      gsap.to(ref.current, { yPercent: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", delay: 0.5 });

      // Hide on scroll down, reveal on scroll up (scroll-driven).
      ScrollTrigger.create({
        start: 200,
        end: "max",
        onUpdate: (self) => {
          gsap.to(ref.current, {
            yPercent: self.direction === 1 ? -160 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });
      // Compact / tinted state after the hero.
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.8,
        end: "max",
        toggleClass: { targets: ref.current, className: "nav-scrolled" },
      });
    },
    { dependencies: [loaded], scope: ref },
  );

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header ref={ref} className="group/nav fixed inset-x-3 top-3 z-40 sm:inset-x-6 sm:top-5">
        <nav className="glass mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/60 py-2 pr-2 pl-2 shadow-[0_10px_50px_-20px_rgba(0,34,122,.45)] transition-all duration-500 group-[.nav-scrolled]/nav:bg-white/80">
          <a href="#top" className="flex items-center gap-3" aria-label="Asif Book Store — home">
            <span className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-gold-400">
              <Image src="/assets/images/logo.jpeg" alt="" fill sizes="44px" className="object-cover" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-heading text-[17px] font-semibold text-royal-900">Asif Book Store</span>
              <span className="block text-[10px] tracking-[.2em] text-royal-700/70 uppercase">Mega Mart</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative block overflow-hidden rounded-full px-4 py-2 text-[13px] text-royal-900 transition hover:bg-royal-800 hover:text-white"
                >
                  <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
                    {l.label}
                  </span>
                  <span className="absolute inset-0 flex translate-y-full items-center justify-center text-gold-300 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0">
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-11 items-center gap-2 rounded-full bg-royal-50 px-4 text-[13px] text-royal-800 transition hover:bg-royal-100"
              aria-label="Search products"
            >
              <Search size={17} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden rounded border border-royal-800/15 px-1.5 text-[10px] md:inline">Ctrl K</kbd>
            </button>
            <button
              onClick={open}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-royal-800 text-white transition hover:bg-gold-400 hover:text-royal-900"
              aria-label={`Open cart, ${count} items`}
            >
              <ShoppingBag size={18} />
              <span
                key={bumpKey}
                className={`absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-royal-900 ring-2 ring-white ${bumpKey ? "animate-bump" : ""}`}
              >
                {count}
              </span>
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-royal-800/15 text-royal-900 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`glass mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/60 transition-all duration-500 ease-[var(--ease-expo)] lg:hidden ${menuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}
        >
          <ul className="grid grid-cols-2 gap-1 p-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 font-heading text-lg text-royal-900 hover:bg-royal-800 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <SearchModal open={searchOpen} onClose={closeSearch} />
    </>
  );
}
