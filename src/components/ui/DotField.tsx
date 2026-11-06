"use client";

import { useEffect, useRef } from "react";

/* Notebook "dot paper" that reacts to the cursor: nearby dots swell, turn gold
   and get pushed aside; clicks send a ripple through the field. One canvas,
   and the loop only runs while something is actually moving. */

const GAP = 28; // px between dots
const BASE_R = 1.3;
const MAX_R = 3.6;
const RANGE = 150; // cursor influence radius
const PUSH = 22; // max cursor displacement
const RIPPLE_SPEED = 0.75; // px per ms
const RIPPLE_LIFE = 1500; // ms
const RIPPLE_BAND = 55; // thickness of the ripple front
const INTRO_SPEED = 1.6; // px per ms for the load-in wave
const INTRO_BAND = 90;

const ROYAL = [0, 34, 122];
const GOLD = [245, 184, 0];

type Ripple = { x: number; y: number; t: number };

interface DotFieldProps {
  /** Starts the load-in wave. Dots stay hidden until this is true. */
  active: boolean;
  /** Seconds to wait after `active` before the wave starts. */
  delay?: number;
  className?: string;
}

export default function DotField({ active, delay = 0, className = "" }: DotFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const startIntro = useRef<(delayMs: number) => void>(() => {});

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const host = canvas?.closest("section") ?? canvas?.parentElement;
    if (!canvas || !ctx || !host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let n = 0;
    let bx = new Float32Array(0);
    let by = new Float32Array(0);
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let originX = 0;
    let originY = 0;
    let maxDist = 0;

    const mouse = { x: -9999, y: -9999, inside: false };
    const smooth = { x: -9999, y: -9999, s: 0 }; // eased cursor + presence strength
    let ripples: Ripple[] = [];
    let introAt: number | null = null; // performance.now() when the wave starts
    let raf = 0;
    let visible = true;
    const excited: number[] = []; // flat [x, y, k, heat, reveal, ...] per frame

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.floor(w / GAP) + 1;
      const rows = Math.floor(h / GAP) + 1;
      const offX = (w - (cols - 1) * GAP) / 2;
      const offY = (h - (rows - 1) * GAP) / 2;
      n = cols * rows;
      bx = new Float32Array(n);
      by = new Float32Array(n);
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      for (let r = 0, i = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          bx[i] = offX + c * GAP;
          by[i] = offY + r * GAP;
        }
      }
      // Wave starts from the logo on desktop, from the heading on mobile.
      originX = w >= 1024 ? w * 0.72 : w * 0.5;
      originY = w >= 1024 ? h * 0.5 : h * 0.3;
      maxDist = Math.hypot(Math.max(originX, w - originX), Math.max(originY, h - originY));
    };

    const frame = (now: number) => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);

      // Ease cursor position and presence so enter/leave fade instead of pop.
      if (mouse.inside) {
        if (smooth.s < 0.01) {
          smooth.x = mouse.x;
          smooth.y = mouse.y;
        }
        smooth.x += (mouse.x - smooth.x) * 0.18;
        smooth.y += (mouse.y - smooth.y) * 0.18;
      }
      smooth.s += ((mouse.inside && !reduced ? 1 : 0) - smooth.s) * 0.08;
      const s = smooth.s;

      // Soft gold spotlight under the cursor.
      if (s > 0.01) {
        const g = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, 320);
        g.addColorStop(0, `rgba(255,210,31,${0.22 * s})`);
        g.addColorStop(1, "rgba(255,210,31,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      ripples = ripples.filter((r) => now - r.t < RIPPLE_LIFE);
      const introR = introAt === null ? -1 : (now - introAt) * INTRO_SPEED;
      const introDone = introR > maxDist + INTRO_BAND;

      let moving = false;
      ctx.fillStyle = `rgba(${ROYAL[0]},${ROYAL[1]},${ROYAL[2]},0.16)`;
      ctx.beginPath(); // all resting dots go in one batched path

      for (let i = 0; i < n; i++) {
        const x0 = bx[i];
        const y0 = by[i];

        // Load-in wave: dots appear as the front passes, with a small pop.
        let reveal = 1;
        let pop = 0;
        if (!introDone) {
          const d0 = Math.hypot(x0 - originX, y0 - originY);
          if (d0 > introR) continue;
          const behind = introR - d0;
          if (behind < INTRO_BAND) {
            reveal = behind / INTRO_BAND;
            pop = Math.sin(reveal * Math.PI);
          }
        }

        let tx = 0;
        let ty = 0;
        let heat = 0;

        if (s > 0.01) {
          const dx = x0 - smooth.x;
          const dy = y0 - smooth.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < RANGE) {
            let f = 1 - d / RANGE;
            f = f * f * (3 - 2 * f) * s;
            tx += (dx / d) * PUSH * f;
            ty += (dy / d) * PUSH * f;
            heat = f;
          }
        }

        for (const r of ripples) {
          const age = now - r.t;
          const dx = x0 - r.x;
          const dy = y0 - r.y;
          const d = Math.hypot(dx, dy) || 1;
          const band = Math.abs(d - age * RIPPLE_SPEED);
          if (band < RIPPLE_BAND) {
            const g = (1 - band / RIPPLE_BAND) * (1 - age / RIPPLE_LIFE);
            tx += (dx / d) * 12 * g;
            ty += (dy / d) * 12 * g;
            heat = Math.max(heat, g);
          }
        }

        ox[i] += (tx - ox[i]) * 0.2;
        oy[i] += (ty - oy[i]) * 0.2;
        if (Math.abs(ox[i]) > 0.05 || Math.abs(oy[i]) > 0.05) moving = true;

        const x = x0 + ox[i];
        const y = y0 + oy[i];
        const k = Math.max(heat, pop * 0.8);

        if (k < 0.02 && reveal >= 1) {
          ctx.moveTo(x + BASE_R, y);
          ctx.arc(x, y, BASE_R, 0, Math.PI * 2);
          continue;
        }

        excited.push(x, y, k, heat, reveal);
      }
      ctx.fill();

      // Excited dots on top: bigger, brighter, tinted from royal towards gold.
      for (let j = 0; j < excited.length; j += 5) {
        const [x, y, k, heat, reveal] = excited.slice(j, j + 5);
        const rad = (BASE_R + (MAX_R - BASE_R) * k) * Math.max(reveal, 0.3);
        const cr = Math.round(ROYAL[0] + (GOLD[0] - ROYAL[0]) * heat);
        const cg = Math.round(ROYAL[1] + (GOLD[1] - ROYAL[1]) * heat);
        const cb = Math.round(ROYAL[2] + (GOLD[2] - ROYAL[2]) * heat);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${(0.16 + 0.7 * k) * reveal})`;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      excited.length = 0;

      const busy = s > 0.01 || ripples.length > 0 || moving || (introAt !== null && !introDone);
      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if (reduced) return;
      Object.assign(mouse, local(e), { inside: true });
      kick();
    };
    const onLeave = () => {
      mouse.inside = false;
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      ripples.push({ ...local(e), t: performance.now() });
      kick();
    };

    startIntro.current = (delayMs: number) => {
      introAt = reduced ? -1e9 : performance.now() + delayMs;
      kick();
    };

    build();
    kick();

    const ro = new ResizeObserver(() => {
      build();
      kick();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    if (active) startIntro.current(delay * 1000);
  }, [active, delay]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
