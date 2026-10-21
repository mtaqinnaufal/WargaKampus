"use client";

import { useMemo, useState } from "react";
import { List, Map, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { PlaceMap } from "@/components/map/place-map";
import { PlaceRow } from "@/components/places/place-row";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PRICE_LEVELS, SITE } from "@/lib/constants";
import type { Campus, Category, Place } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "semua";

export function ExploreClient({
  places,
  categories,
  campus,
  initialQuery = "",
  initialCategory = ALL,
  isDemo,
}: {
  places: Place[];
  categories: Category[];
  campus: Campus;
  initialQuery?: string;
  initialCategory?: string;
  isDemo: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [priceLevel, setPriceLevel] = useState<number | null>(null);
  const [facility, setFacility] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return [...places]
      .filter((place) => {
        if (category !== ALL && place.category.slug !== category) return false;
        if (priceLevel !== null && place.price_level !== priceLevel) return false;
        if (facility && !place.facilities.includes(facility)) return false;
        if (maxDistance !== null && (place.distance_km ?? 99) > maxDistance) return false;
        if (!term) return true;

        const haystack = [
          place.name,
          place.category.name,
          place.description,
          place.address,
          ...place.facilities,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(term);
      })
      .sort((a, b) => (a.distance_km ?? 99) - (b.distance_km ?? 99));
  }, [places, query, category, priceLevel, facility, maxDistance]);

  const activeFilters =
    (category !== ALL ? 1 : 0) +
    (priceLevel !== null ? 1 : 0) +
    (facility ? 1 : 0) +
    (maxDistance !== null ? 1 : 0);

  function resetFilters() {
    setQuery("");
    setCategory(ALL);
    setPriceLevel(null);
    setFacility(null);
    setMaxDistance(null);
  }

  const facilityOptions = Array.from(
    new Set(places.flatMap((place) => place.facilities)),
  )
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 14);

  return (
    <div className="container-page py-6 lg:py-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
            <span className="font-mono text-[11px] text-muted">
              {campus.name} · {campus.city}
            </span>
            {isDemo ? <Badge variant="signal">Data demo</Badge> : null}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Jelajah sekitar kampus.
          </h1>
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">
            Cari tempat yang sudah terverifikasi. Harga dan fasilitas adalah informasi awal dari
            komunitas, bukan jaminan.
          </p>
        </div>

        <div className="flex items-center gap-2 lg:hidden" role="group" aria-label="Tampilan">
          <button
            type="button"
            onClick={() => setMobileView("list")}
            aria-pressed={mobileView === "list"}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-sm border px-3 text-sm",
              mobileView === "list" ? "border-ink bg-ink text-surface" : "border-line text-muted",
            )}
          >
            <List className="h-4 w-4" aria-hidden="true" />
            Daftar
          </button>
          <button
            type="button"
            onClick={() => setMobileView("map")}
            aria-pressed={mobileView === "map"}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-sm border px-3 text-sm",
              mobileView === "map" ? "border-ink bg-ink text-surface" : "border-line text-muted",
            )}
          >
            <Map className="h-4 w-4" aria-hidden="true" />
            Peta
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:p-5">
        <label htmlFor="place-search" className="sr-only">
          Cari tempat
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            id="place-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama, kategori, fasilitas"
            type="search"
            className="h-11 pl-9"
          />
        </div>

        <div
          className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter kategori"
        >
          <button
            type="button"
            onClick={() => setCategory(ALL)}
            aria-pressed={category === ALL}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              category === ALL
                ? "border-ink bg-signal text-ink"
                : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink",
            )}
          >
            Semua
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.slug)}
              aria-pressed={category === item.slug}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === item.slug
                  ? "border-ink bg-signal text-ink"
                  : "border-line bg-surface text-muted hover:border-ink/40 hover:text-ink",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        <details className="mt-3 border-t border-line pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-ink">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Filter lain
              {activeFilters > 0 ? (
                <span className="rounded-full bg-ink px-1.5 py-0.5 font-mono text-[10px] text-surface">
                  {activeFilters}
                </span>
              ) : null}
            </span>
            <span className="font-mono text-[10px] text-muted">{filtered.length} hasil</span>
          </summary>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <fieldset>
              <legend className="text-xs font-medium text-ink">Harga</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPriceLevel(null)}
                  aria-pressed={priceLevel === null}
                  className={cn(
                    "rounded-full border px-2.5 py-1.5 text-xs transition-colors",
                    priceLevel === null
                      ? "border-ink bg-paper-deep text-ink"
                      : "border-line text-muted hover:border-ink/40 hover:text-ink",
                  )}
                >
                  Semua
                </button>
                {PRICE_LEVELS.slice(0, 3).map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setPriceLevel(level.value)}
                    aria-pressed={priceLevel === level.value}
                    className={cn(
                      "rounded-full border px-2.5 py-1.5 text-xs transition-colors",
                      priceLevel === level.value
                        ? "border-ink bg-paper-deep text-ink"
                        : "border-line text-muted hover:border-ink/40 hover:text-ink",
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="distance-filter" className="text-xs font-medium text-ink">
                Jarak maksimum
              </label>
              <select
                id="distance-filter"
                value={maxDistance ?? ""}
                onChange={(event) =>
                  setMaxDistance(event.target.value ? Number(event.target.value) : null)
                }
                className="mt-2 h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink"
              >
                <option value="">Semua jarak</option>
                <option value="1">1 km</option>
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="5">5 km</option>
              </select>
            </div>

            <div>
              <label htmlFor="facility-filter" className="text-xs font-medium text-ink">
                Fasilitas
              </label>
              <select
                id="facility-filter"
                value={facility ?? ""}
                onChange={(event) => setFacility(event.target.value || null)}
                className="mt-2 h-10 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink"
              >
                <option value="">Semua fasilitas</option>
                {facilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="w-full"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset filter
              </Button>
            </div>
          </div>
        </details>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section
          className={cn("min-w-0", mobileView === "list" && "hidden lg:block")}
          aria-label="Peta tempat"
        >
          <div className="relative h-[380px] overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:h-[440px] lg:h-[560px]">
            <PlaceMap
              places={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              height="h-full"
              className="h-full rounded-none border-0"
              ariaLabel="Peta tempat terverifikasi di sekitar kampus"
            />
            <div
              className="pointer-events-none absolute right-3 top-3 z-[500] flex items-center gap-2 rounded-full border border-line bg-surface/95 px-2.5 py-1 font-mono text-[10px] text-muted shadow-sm backdrop-blur"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              {filtered.length} tempat
            </div>
            <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-sm border border-line bg-surface/95 px-2 py-1 font-mono text-[10px] text-muted">
              {SITE.osmAttribution}
            </div>
          </div>
        </section>

        <section
          className={cn("min-w-0", mobileView === "map" && "hidden lg:block")}
          aria-label="Daftar tempat"
        >
          <div className="flex flex-col overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_2px_rgba(11,26,40,0.04)] lg:h-[560px]">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div>
                <h2 className="font-display text-lg font-semibold leading-tight">
                  Daftar tempat
                </h2>
                <p className="mt-0.5 font-mono text-[10px] text-muted" role="status">
                  {filtered.length} tempat · urut dari yang terdekat
                </p>
              </div>
              <Badge variant="outline" className="shrink-0">
                Terdekat
              </Badge>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((place) => (
                  <PlaceRow
                    key={place.id}
                    place={place}
                    active={selectedId === place.id}
                    onHover={setSelectedId}
                  />
                ))
              ) : (
                <div className="p-4">
                  <EmptyState
                    title="Belum ada yang cocok"
                    description="Coba hapus satu filter atau cari kata yang lebih umum, misalnya nama kategori."
                    action={
                      <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
                        Hapus semua filter
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
