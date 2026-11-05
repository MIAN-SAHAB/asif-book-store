import { Star } from "lucide-react";

export default function Stars({
  rating,
  reviews,
  className = "",
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <div className="flex" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={13}
            className={i < Math.round(rating) ? "fill-gold-500 text-gold-500" : "fill-current/10 text-current/25"}
          />
        ))}
      </div>
      <span className="opacity-70">
        {rating.toFixed(1)}
        {reviews !== undefined && ` (${reviews})`}
      </span>
    </div>
  );
}
