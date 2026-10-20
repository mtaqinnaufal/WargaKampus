"use client";

import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import type { Place } from "@/lib/types";
import { categoryColor, cn, formatDistance, formatPriceRange } from "@/lib/utils";

export function PlaceRow({
  place,
  active = false,
  onHover,
}: {
  place: Place;
  active?: boolean;
  onHover?: (id: string) => void;
}) {
  return (
    <Link
      href={`/tempat/${place.slug}`}
      onMouseEnter={() => onHover?.(place.id)}
      onFocus={() => onHover?.(place.id)}
      className={cn(
        "block border-b border-line px-4 py-4 transition-colors",
        active ? "bg-signal/15" : "hover:bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: categoryColor(place.category.slug) }}
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] text-muted">{place.category.name}</span>
            <span className="text-[10px] text-muted">·</span>
            <span className="text-[10px] text-muted">{formatDistance(place.distance_km)}</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-ink">
            {place.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {place.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating rating={place.rating_avg} count={place.review_count} />
            <span className="text-xs text-muted">
              {formatPriceRange(place.price_min, place.price_max)}
            </span>
          </div>
        </div>
        <div className="hidden shrink-0 text-right text-[10px] leading-relaxed text-muted sm:block">
          {place.facilities.slice(0, 3).map((facility) => (
            <div key={facility}>{facility}</div>
          ))}
        </div>
      </div>
    </Link>
  );
}
