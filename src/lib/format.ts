const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export function formatPrice(value: number): string {
  return `Rs ${pkr.format(Math.round(value))}`;
}

export function formatNumber(value: number): string {
  return pkr.format(Math.round(value));
}

/** Builds an SVG path for a gear/cog — used by watch dials and the bundle builder. */
export function gearPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  teeth: number,
): string {
  const step = (Math.PI * 2) / teeth;
  const parts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [a, inner],
      [a + step * 0.15, outer],
      [a + step * 0.45, outer],
      [a + step * 0.6, inner],
    ];
    pts.forEach(([ang, r], j) => {
      const x = (cx + Math.cos(ang) * r).toFixed(2);
      const y = (cy + Math.sin(ang) * r).toFixed(2);
      parts.push(`${i === 0 && j === 0 ? "M" : "L"}${x} ${y}`);
    });
  }
  return `${parts.join(" ")} Z`;
}

/** Tick marks for a clock face, as a single path string. */
export function dialTicks(cx: number, cy: number, r: number, count: number, longEvery = 5): string {
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const len = i % longEvery === 0 ? r * 0.12 : r * 0.05;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a) * (r - len);
    const y2 = cy + Math.sin(a) * (r - len);
    parts.push(`M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`);
  }
  return parts.join(" ");
}
