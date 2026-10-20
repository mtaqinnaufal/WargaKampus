"use client";

import dynamic from "next/dynamic";
import type { Place } from "@/lib/types";

export type PlaceMapProps = {
  places: Place[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  interactive?: boolean;
  fitToPlaces?: boolean;
  height?: string;
  className?: string;
  ariaLabel?: string;
};

const MapInner = dynamic(() => import("./map-inner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-paper-deep">
      <span className="font-mono text-xs text-muted">Memuat peta...</span>
    </div>
  ),
});

export function PlaceMap({
  height = "h-[420px]",
  className,
  ariaLabel = "Peta tempat di sekitar kampus",
  ...props
}: PlaceMapProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-md border border-line bg-paper-deep ${height} ${className ?? ""}`}
      role="region"
      aria-label={ariaLabel}
    >
      <MapInner {...props} />
    </div>
  );
}
