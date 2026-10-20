"use client";

import L from "leaflet";
import { Crosshair } from "lucide-react";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { CAMPUS_CENTER } from "@/lib/constants";

const pickerIcon = L.divIcon({
  className: "",
  html: '<div class="kp-pin kp-pin--active" style="--pin: var(--color-signal)"></div>',
  iconSize: [30, 38],
  iconAnchor: [15, 38],
});

function ClickHandler({
  onChange,
}: {
  onChange: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
}) {
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoMessage("Browser ini tidak mendukung lokasi.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(position.coords.latitude, position.coords.longitude);
        setGeoMessage("Lokasi Anda dipakai. Geser pin jika perlu.");
      },
      () => setGeoMessage("Izin lokasi ditolak. Pilih titik di peta secara manual."),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div>
      <div className="relative h-[340px] overflow-hidden rounded-md border border-line">
        <MapContainer
          center={[CAMPUS_CENTER.latitude, CAMPUS_CENTER.longitude]}
          zoom={15}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          <ClickHandler onChange={onChange} />
          <Marker
            position={[latitude, longitude]}
            icon={pickerIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const point = event.target.getLatLng();
                onChange(point.lat, point.lng);
              },
            }}
          />
        </MapContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={useMyLocation}>
          <Crosshair className="h-4 w-4" aria-hidden="true" />
          Gunakan lokasi saya
        </Button>
        <p className="font-mono text-xs text-muted">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      </div>
      {geoMessage ? (
        <p className="mt-2 text-xs leading-relaxed text-muted" role="status">
          {geoMessage}
        </p>
      ) : null}
    </div>
  );
}
