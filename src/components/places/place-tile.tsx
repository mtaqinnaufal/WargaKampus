import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryArt } from "@/components/category-art";
import { StarRating } from "@/components/ui/star-rating";
import type { Place } from "@/lib/types";
import { categoryColor, cn, formatDistance, formatPriceRange } from "@/lib/utils";

export function PlaceTile({
  place,
  featured = false,
  className,
}: {
  place: Place;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/tempat/${place.slug}`}
      className={cn(
        "group block border-t border-line py-4 transition-colors hover:bg-surface/70",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-4",
          featured ? "sm:grid-cols-[190px_1fr]" : "grid-cols-[88px_1fr]",
        )}
      >
        <CategoryArt
          slug={place.category.slug}
          name={place.category.name}
          className={featured ? "h-40 sm:h-44" : "h-24"}
          label={featured ? "Foto komunitas menyusul" : undefined}
        />

        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: categoryColor(place.category.slug) }}
                aria-hidden="true"
              />
              <span className="font-mono text-[10px] text-muted">{place.category.name}</span>
              <span className="ml-auto text-[11px] text-muted">
                {formatDistance(place.distance_km)}
              </span>
            </div>
            <h3
              className={cn(
                "mt-1 font-display font-semibold leading-tight text-ink",
                featured ? "text-2xl sm:text-3xl" : "text-lg",
              )}
            >
              {place.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
              {place.description}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <StarRating rating={place.rating_avg} count={place.review_count} />
              <span className="text-xs text-muted">
                {formatPriceRange(place.price_min, place.price_max)}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink">
              Lihat
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
