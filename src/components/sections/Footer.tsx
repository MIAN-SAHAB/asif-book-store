"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { ArrowUp, ArrowUpRight, Clock, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";

const COLUMNS = [
  { title: "Shop", links: [["Books", "#books"], ["Uniforms", "#uniforms"], ["Gadgets", "#gadgets"], ["Watches", "#watches"], ["Mega Bundles", "#bundle"]] },
  { title: "Schools", links: [["The City School", "#schools"], ["Beaconhouse", "#schools"], ["Lahore Grammar School", "#schools"], ["Roots Millennium", "#schools"], ["All partners", "#schools"]] },
  { title: "Follow", links: [["Instagram", "#"], ["Facebook", "#"], ["WhatsApp", "#"], ["TikTok", "#"]] },
] as const;

const BIG = ["ASIF", "BOOK", "STORE"];

/** Section 12b — footer with newsletter, store details and oversized scroll-revealed typography. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".ft-char",
        { yPercent: 110, rotate: 8 },
        {
          yPercent: 0,
          rotate: 0,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: { trigger: ".ft-big", start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        },
      );
      gsap.fromTo(
        ".ft-news",
        { y: 120, scale: 0.92 },
        { y: 0, scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 40%", scrub: 0.6 } },
      );
      gsap.fromTo(
        ".ft-col",
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".ft-cols", start: "top 95%", end: "top 60%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <footer ref={root} className="relative overflow-hidden bg-royal-900 text-white">
      <div className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        {/* Newsletter */}
        <div className="ft-news relative overflow-hidden rounded-[36px] bg-gold-400 p-8 text-royal-900 sm:p-12">
          <div className="absolute -right-16 -bottom-24 h-72 w-72 rounded-full border-[40px] border-royal-800/10" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] tracking-[.3em] uppercase opacity-70">Newsletter</p>
              <h3 className="mt-3 text-4xl leading-[0.95] font-semibold sm:text-5xl">Book lists, new arrivals &amp; term-start offers.</h3>
            </div>
            {subscribed ? (
              <p className="animate-fade-up rounded-3xl bg-royal-900 p-6 font-heading text-xl text-gold-300">
                Shukriya! You&apos;re on the list — watch your inbox before the new term.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-14 flex-1 rounded-full bg-white/70 px-6 text-royal-900 outline-none placeholder:text-royal-900/40 focus:bg-white"
                />
                <MagneticButton type="submit" variant="royal">
                  Subscribe <Send size={15} />
                </MagneticButton>
              </form>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className="ft-cols mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="ft-col lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-gold-400">
                <Image src="/assets/images/logo.jpeg" alt="" fill sizes="56px" className="object-cover" />
              </span>
              <div>
                <p className="font-heading text-xl font-semibold">Asif Book Store</p>
                <p className="text-xs opacity-60">Books · Uniforms · Gadgets · Watches</p>
              </div>
            </div>
            <p className="mt-6 flex items-start gap-2 rounded-2xl border border-gold-400/30 p-4 text-xs text-gold-200">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-gold-400" />
              Authorized Dealer for Uniforms &amp; Course Books of The City School and other reputed schools.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" /> Main Market Road, City Centre, Pakistan
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-gold-400" /> +92 300 1234567
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-gold-400" /> hello@asifbookstore.com
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-gold-400" /> Mon–Sat 10am – 10pm · Sun 2pm – 10pm
              </li>
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="ft-col lg:col-span-2">
              <p className="text-[11px] tracking-[.3em] text-gold-400 uppercase">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="group inline-flex items-center gap-1 text-sm text-white/75 transition hover:text-white">
                      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                        {label}
                      </span>
                      <ArrowUpRight size={13} className="opacity-0 transition group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="ft-col flex items-start lg:col-span-2 lg:justify-end">
            <MagneticButton href="#top" variant="ghost-light" ariaLabel="Back to top" className="h-20 w-20 px-0! py-0!">
              <ArrowUp size={20} />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Oversized reveal typography */}
      <div className="ft-big mt-20 flex flex-wrap justify-center gap-x-[3vw] overflow-hidden px-3 leading-[0.8]" aria-hidden>
        {BIG.map((w, wi) => (
          <span key={w} className="flex overflow-hidden pt-[1vw] pb-[1.5vw]">
            {w.split("").map((c, i) => (
              <span
                key={i}
                className={`ft-char inline-block font-heading text-[13vw] font-bold tracking-[-0.05em] ${wi === 1 ? "text-gold-gradient" : "text-white"}`}
              >
                {c}
              </span>
            ))}
          </span>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/50 sm:flex-row sm:px-8">
          <p>© 2026 Asif Book Store. All rights reserved.</p>
          <p>Developed by <a className="text-gold-gradient hover:text-white" href="http://www.hamzadaniyal.com" rel="noopener noreferrer" target="_blank" >Hamza Daniyal</a></p>
        </div>
      </div>
    </footer>
  );
}
