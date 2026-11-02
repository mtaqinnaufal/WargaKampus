// Location picker (vanilla Leaflet), ported from components/map/location-picker.tsx.
import { CAMPUS_CENTER } from "../config.js";
import { buttonClass } from "./ui.js";
import { icon } from "./icons.js";

const pickerIcon = () =>
  L.divIcon({
    className: "",
    html: '<div class="kp-pin kp-pin--active" style="--pin: var(--color-signal)"></div>',
    iconSize: [30, 38],
    iconAnchor: [15, 38],
  });

export function mountLocationPicker(container, { latitude, longitude, onChange }) {
  let lat = latitude;
  let lng = longitude;

  container.innerHTML = `<div>
    <div class="relative h-[340px] overflow-hidden rounded-md border border-line">
      <div data-picker-map class="h-full w-full"></div>
    </div>
    <div class="mt-3 flex flex-wrap items-center gap-3">
      <button type="button" data-picker-geo class="${buttonClass({ variant: "outline", size: "sm" })}">${icon(
        "crosshair",
        "h-4 w-4",
      )} Gunakan lokasi saya</button>
      <p class="font-mono text-xs text-muted" data-picker-coords>${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
    </div>
    <p class="mt-2 text-xs leading-relaxed text-muted" role="status" data-picker-msg></p>
  </div>`;

  const mapEl = container.querySelector("[data-picker-map]");
  const coordsEl = container.querySelector("[data-picker-coords]");
  const msgEl = container.querySelector("[data-picker-msg]");
  const geoBtn = container.querySelector("[data-picker-geo]");

  const map = L.map(mapEl, { center: [CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude], zoom: 15, scrollWheelZoom: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const marker = L.marker([lat, lng], { icon: pickerIcon(), draggable: true }).addTo(map);

  const sync = (newLat, newLng) => {
    lat = newLat;
    lng = newLng;
    coordsEl.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    onChange(lat, lng);
  };

  map.on("click", (event) => {
    marker.setLatLng(event.latlng);
    sync(event.latlng.lat, event.latlng.lng);
  });
  marker.on("dragend", () => {
    const point = marker.getLatLng();
    sync(point.lat, point.lng);
  });

  geoBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      msgEl.textContent = "Browser ini tidak mendukung lokasi.";
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: newLat, longitude: newLng } = position.coords;
        marker.setLatLng([newLat, newLng]);
        map.setView([newLat, newLng], 16);
        sync(newLat, newLng);
        msgEl.textContent = "Lokasi Anda dipakai. Geser pin jika perlu.";
      },
      () => {
        msgEl.textContent = "Izin lokasi ditolak. Pilih titik di peta secara manual.";
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  });

  const observer = new ResizeObserver(() => map.invalidateSize());
  observer.observe(mapEl);

  return { setPosition(newLat, newLng) {
    marker.setLatLng([newLat, newLng]);
    sync(newLat, newLng);
  } };
}
