// Leaflet map ported from src/components/map/map-inner.tsx (vanilla Leaflet).
import { CAMPUS_CENTER, url } from "../config.js";
import { categoryColor, escapeHtml, formatDistance, formatPriceRange } from "../utils.js";
import { starRating } from "./ui.js";

function popupHtml(place) {
  return `<div class="w-56 p-0.5">
    <p class="font-mono text-[10px] text-muted">${escapeHtml(place.category.name)}</p>
    <h3 class="mt-1 font-display text-lg font-semibold leading-tight text-ink">${escapeHtml(place.name)}</h3>
    <div class="mt-1">${starRating(place.rating_avg, { count: place.review_count })}</div>
    <p class="mt-1 text-xs text-muted">${escapeHtml(
      formatPriceRange(place.price_min, place.price_max),
    )} · ${escapeHtml(formatDistance(place.distance_km))}</p>
    <a href="${url(`/tempat/${place.slug}`)}" class="mt-2 inline-block text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2">Lihat tempat</a>
  </div>`;
}

function pinIcon(place, active) {
  const label = active
    ? `<span class="kp-pin-label">${escapeHtml(place.name.slice(0, 28))}</span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div class="kp-pin pin-drop${active ? " kp-pin--active" : ""}" style="--pin:${categoryColor(
      place.category.slug,
    )}">${label}</div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

export function createPlaceMap(container, options = {}) {
  const {
    places = [],
    selectedId = null,
    onSelect = null,
    interactive = true,
    fitToPlaces = false,
  } = options;

  const map = L.map(container, {
    center: [CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude],
    zoom: CAMPUS_CENTER.zoom,
    scrollWheelZoom: interactive,
    dragging: interactive,
    zoomControl: interactive,
    doubleClickZoom: interactive,
    boxZoom: interactive,
    keyboard: interactive,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const markers = places.map((place) => {
    const active = place.id === selectedId;
    const marker = L.marker([place.latitude, place.longitude], {
      icon: pinIcon(place, active),
      interactive,
      title: place.name,
    });
    if (interactive) {
      marker.bindPopup(popupHtml(place));
      if (onSelect) marker.on("click", () => onSelect(place.id));
    }
    marker.addTo(map);
    return marker;
  });

  if (fitToPlaces && places.length) {
    const bounds = L.latLngBounds(places.map((place) => [place.latitude, place.longitude]));
    map.fitBounds(bounds.pad(0.18), { maxZoom: 16, animate: false });
  }

  const observer = new ResizeObserver(() => map.invalidateSize());
  observer.observe(container);

  return {
    map,
    markers,
    setSelected(id) {
      markers.forEach((marker, index) => {
        marker.setIcon(pinIcon(places[index], places[index].id === id));
      });
    },
    destroy() {
      observer.disconnect();
      map.remove();
    },
  };
}
