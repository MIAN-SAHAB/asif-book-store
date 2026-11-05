import type { ReactNode } from "react";

export default function Eyebrow({
  children,
  tone = "royal",
  className = "",
}: {
  children: ReactNode;
  tone?: "royal" | "gold" | "light";
  className?: string;
}) {
  const colors =
    tone === "gold"
      ? "text-gold-400 border-gold-400/40"
      : tone === "light"
        ? "text-white/80 border-white/25"
        : "text-royal-700 border-royal-700/25";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] tracking-[.22em] uppercase ${colors} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
