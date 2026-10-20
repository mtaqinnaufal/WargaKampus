import { Badge } from "@/components/ui/badge";
import type { PlaceStatus } from "@/lib/types";

const statusMap: Record<
  PlaceStatus,
  { label: string; variant: "signal" | "verify" | "live" | "neutral" }
> = {
  pending: { label: "Menunggu verifikasi", variant: "signal" },
  verified: { label: "Terverifikasi", variant: "verify" },
  rejected: { label: "Ditolak", variant: "live" },
  closed: { label: "Tutup sementara", variant: "neutral" },
};

export function StatusBadge({ status }: { status: PlaceStatus }) {
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
