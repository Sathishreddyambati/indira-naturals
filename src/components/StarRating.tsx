import { Star } from "lucide-react";

export default function StarRating({
  rating,
  size = 16,
  showValue = false,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= rounded;
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "fill-brand-gold text-brand-gold" : "fill-transparent text-brand-brown/30"}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-xs font-medium text-brand-charcoal/70">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
