import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
  tone = "dark",
  className,
}: {
  compact?: boolean;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="WargaKampus, kembali ke beranda"
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "light" ? "text-surface" : "text-ink",
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="10"
          fill="#F2C200"
          stroke="#0B1A28"
          strokeWidth="4"
        />
        <path
          d="M32 12c-8.8 0-16 6.7-16 15 0 11.3 16 26 16 26s16-14.7 16-26c0-8.3-7.2-15-16-15Z"
          fill="none"
          stroke="#0B1A28"
          strokeWidth="3.6"
          strokeLinejoin="round"
        />
        <path
          d="M23 24.5l4 11 5-8 5 8 4-11"
          fill="none"
          stroke="#0B1A28"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compact ? (
        <span
          className={cn(
            "font-display text-[20px] font-bold leading-none tracking-[-0.045em]",
            tone === "light" ? "text-surface" : "text-ink",
          )}
        >
          WargaKampus
        </span>
      ) : null}
    </Link>
  );
}
