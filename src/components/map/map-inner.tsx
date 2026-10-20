"use client";

import L from "leaflet";
import Link from "next/link";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { StarRating } from "@/components/ui/star-rating";
import { CAMPUS_CENTER } from "@/lib/constants";
import type { Place } from "@/lib/types";
import { categoryColor, formatDistance, formatPriceRange } from "@/lib/utils";
import type { PlaceMapProps } from "./place-map";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

function createIcon(place: Place, active: boolean) {
  const label = active
    ? `<span class="kp-pin-label">${escapeHtml(place.name.slice(0, 28))}</span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div class="kp-pin${active ? " kp-pin--active" : ""}" style="--pin:${categoryColor(place.category.slug)}">${label}</div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

function MapFocus({ place }: { place: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (!place) return;
    map.flyTo([place.latitude, place.longitude], Math.max(map.getZoom(), 16), {
      duration: 0.6,
    });
  }, [map, place]);

  return null;
}

function FitBounds({ places }: { places: Place[] }) {
  const map = useMap();
  const ids = places.map((place) => place.id).join("|");

  useEffect(() => {
    if (!places.length) return;
    const bounds = L.latLngBounds(
      places.map((place) => [place.latitude, place.longitude] as [number, number]),
    );
    map.fitBounds(bounds.pad(0.18), { maxZoom: 16, animate: false });
    // The id list is the stable dependency. Re-fitting on every object identity change would fight the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ids]);

  return null;
}

export default function MapInner({
  places,
  selectedId,
  onSelect,
  interactive = true,
  fitToPlaces = false,
}: PlaceMapProps) {
  const selected = places.find((place) => place.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude]}
      zoom={CAMPUS_CENTER.zoom}
      className="h-full w-full"
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
      doubleClickZoom={interactive}
      boxZoom={interactive}
      keyboard={interactive}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {places.map((place) => {
        const active = place.id === selectedId;
        return (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createIcon(place, active)}
            eventHandlers={
              interactive && onSelect
                ? {
                    click: () => onSelect(place.id),
                  }
                : undefined
            }
          >
            {interactive ? (
              <Popup>
                <div className="w-56 p-0.5">
                  <p className="font-mono text-[10px] text-muted">{place.category.name}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-ink">
                    {place.name}
                  </h3>
                  <div className="mt-1">
                    <StarRating rating={place.rating_avg} count={place.review_count} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {formatPriceRange(place.price_min, place.price_max)} ·{" "}
                    {formatDistance(place.distance_km)}
                  </p>
                  <Link
                    href={`/tempat/${place.slug}`}
                    className="mt-2 inline-block text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2"
                  >
                    Lihat tempat
                  </Link>
                </div>
              </Popup>
            ) : null}
          </Marker>
        );
      })}

      {fitToPlaces ? <FitBounds places={places} /> : null}
      {interactive && selected ? <MapFocus place={selected} /> : null}
    </MapContainer>
  );
}
