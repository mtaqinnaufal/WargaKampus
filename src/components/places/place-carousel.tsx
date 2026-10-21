"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryArt } from "@/components/category-art";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import type { Place } from "@/lib/types";
import { cn, formatDistance, formatPriceRange } from "@/lib/utils";

const CATEGORY_IMAGES: Record<string, string> = {
  makan:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  nongkrong:
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
  nugas:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  laundry:
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80",
  fotokopi:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  sembako:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  kesehatan:
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
  hiburan:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
};

export function PlaceCarousel({ places }: { places: Place[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const onResize = () => updateEdges();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [places.length, updateEdges]);

  function scrollByCards(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-carousel-card]");
    const width = card ? card.offsetWidth + 16 : 336;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    track.scrollBy({ left: direction * width, behavior });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
      moved: false,
    };
    setDragging(true);
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 5) dragRef.current.moved = true;
    track.scrollLeft = dragRef.current.scrollLeft - delta;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  }

  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] text-muted">
          {places.length} tempat · geser untuk lihat lainnya
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={edges.start}
            aria-label="Geser ke kiri"
            className="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={edges.end}
            aria-label="Geser ke kanan"
            className="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Daftar tempat, dapat digeser ke kiri dan kanan"
        onScroll={updateEdges}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        style={{ scrollSnapType: dragging ? "none" : undefined }}
        className={cn(
          "no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70",
          dragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
      >
        {places.map((place) => (
          <PlaceCarouselCard key={place.id} place={place} />
        ))}
      </div>
    </div>
  );
}

function PlaceCarouselCard({ place }: { place: Place }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = CATEGORY_IMAGES[place.category.slug];
  const showImage = Boolean(image) && !imageFailed;

  return (
    <Link
      href={`/tempat/${place.slug}`}
      draggable={false}
      data-carousel-card
      className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70 sm:w-[320px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
        {showImage ? (
          <Image
            src={image}
            alt={`Ilustrasi kategori ${place.category.name}`}
            fill
            sizes="(max-width: 640px) 280px, 320px"
            draggable={false}
            onError={() => setImageFailed(true)}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <CategoryArt
            slug={place.category.slug}
            name={place.category.name}
            className="h-full rounded-none border-0"
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute left-3 top-3">
          <Badge variant="signal">{place.category.name}</Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-display text-lg font-semibold leading-tight text-surface sm:text-xl">
            {place.name}
          </p>
          <p className="mt-1 font-mono text-[10px] text-surface/80">
            {formatDistance(place.distance_km)} ·{" "}
            {formatPriceRange(place.price_min, place.price_max)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between gap-2">
          <StarRating rating={place.rating_avg} count={place.review_count} />
          <ArrowUpRight
            className="h-4 w-4 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{place.description}</p>
      </div>
    </Link>
  );
}
