"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/layout/Navbar";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import SchoolPartners from "@/components/sections/SchoolPartners";
import CategoryStory from "@/components/sections/CategoryStory";
import BooksEmporium from "@/components/sections/BooksEmporium";
import UniformsHub from "@/components/sections/UniformsHub";
import BrandMetrics from "@/components/sections/BrandMetrics";
import TechZone from "@/components/sections/TechZone";
import WatchShowcase from "@/components/sections/WatchShowcase";
import BundleBuilder from "@/components/sections/BundleBuilder";
import Reviews from "@/components/sections/Reviews";
import Footer from "@/components/sections/Footer";

export default function HomeClient() {
  const [loaded, setLoaded] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const onLoaded = useCallback(() => setLoaded(true), []);

  // Filters change section heights; keep every downstream ScrollTrigger in sync.
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let timer: number | undefined;
    let lastHeight = el.offsetHeight;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (h === lastHeight) return;
      lastHeight = h;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (loaded) ScrollTrigger.refresh();
  }, [loaded]);

  // Only Navbar and Hero depend on `loaded`. Keeping the rest as stable
  // elements stops the preloader handoff from re-rendering every section.
  const sections = useMemo(
    () => (
      <>
        <SchoolPartners />
        <CategoryStory />
        <BooksEmporium />
        <UniformsHub />
        <BrandMetrics />
        <TechZone />
        <WatchShowcase />
        <BundleBuilder />
        <Reviews />
      </>
    ),
    [],
  );
  const tail = useMemo(
    () => (
      <>
        <Footer />
        <CartDrawer />
      </>
    ),
    [],
  );

  return (
    <CartProvider>
      <Preloader onComplete={onLoaded} />
      <Navbar loaded={loaded} />
      <main ref={mainRef} className="overflow-x-clip">
        <Hero loaded={loaded} />
        {sections}
      </main>
      {tail}
    </CartProvider>
  );
}
