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
      aria-label="KosPintar, kembali ke beranda"
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "light" ? "text-surface" : "text-ink",
        className,
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border-2 border-ink bg-signal text-ink">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
          <path d="M12.7 7 9.2 13h2.9l-.8 4.1L15 11h-2.9l.6-4Z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {!compact ? (
        <span
          className={cn(
            "font-display text-[22px] font-bold leading-none tracking-[-0.04em]",
            tone === "light" ? "text-surface" : "text-ink",
          )}
        >
          KosPintar
        </span>
      ) : null}
    </Link>
  );
}
