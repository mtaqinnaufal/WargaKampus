import Link from "next/link";
import { CategoryArt } from "@/components/category-art";
import { StatusBadge } from "@/components/status-badge";
import { StarRating } from "@/components/ui/star-rating";
import type { Place } from "@/lib/types";
import { categoryColor, cn, formatDistance, formatPriceRange } from "@/lib/utils";

export function PlaceGridCard({
  place,
  className,
}: {
  place: Place;
  className?: string;
}) {
  return (
    <Link
      href={`/tempat/${place.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lift",
        className,
      )}
    >
      <CategoryArt
        slug={place.category.slug}
        name={place.category.name}
        className="h-36 rounded-none border-0"
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[10px] text-muted">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: categoryColor(place.category.slug) }}
            aria-hidden="true"
          />
          <span className="font-mono">{place.category.name}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDistance(place.distance_km)}</span>
        </div>
        {place.status !== "verified" ? (
          <div className="mt-2">
            <StatusBadge status={place.status} />
          </div>
        ) : null}
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight text-ink">
          {place.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
          {place.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <StarRating rating={place.rating_avg} count={place.review_count} />
          <span className="text-[11px] text-muted">
            {formatPriceRange(place.price_min, place.price_max)}
          </span>
        </div>
      </div>
    </Link>
  );
}
