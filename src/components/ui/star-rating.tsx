"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  className,
  showCount = true,
}: {
  rating: number;
  count?: number;
  className?: string;
  showCount?: boolean;
}) {
  const rounded = Math.round(rating);
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      role="img"
      aria-label={rating > 0 ? `${rating.toFixed(1)} dari 5 bintang` : "Belum ada rating"}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={cn(
              "h-3.5 w-3.5",
              value <= rounded ? "fill-signal text-ink" : "fill-transparent text-line-strong",
            )}
            strokeWidth={1.5}
          />
        ))}
      </span>
      {showCount ? (
        <span className="text-xs text-muted">
          {rating > 0 ? rating.toFixed(1) : "Baru"}
          {count && count > 0 ? ` (${count})` : ""}
        </span>
      ) : null}
    </span>
  );
}

export function RatingInput({
  name = "rating",
  defaultValue = 5,
  label = "Rating",
}: {
  name?: string;
  defaultValue?: number;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} bintang`}
            onClick={() => setValue(star)}
            className="grid h-10 w-10 place-items-center rounded-sm border border-transparent hover:bg-paper-deep"
          >
            <Star
              className={cn(
                "h-6 w-6",
                star <= value ? "fill-signal text-ink" : "fill-transparent text-line-strong",
              )}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        ))}
        <span className="ml-2 font-mono text-sm text-muted">{value}/5</span>
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
