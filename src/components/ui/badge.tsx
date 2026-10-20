import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "neutral" | "signal" | "ink" | "live" | "verify" | "outline";

const variants: Record<BadgeVariant, string> = {
  neutral: "border-line bg-paper-deep text-ink-soft",
  signal: "border-ink/20 bg-signal text-ink",
  ink: "border-ink bg-ink text-surface",
  live: "border-live/30 bg-live/10 text-live",
  verify: "border-verify/30 bg-verify/10 text-verify",
  outline: "border-line-strong bg-transparent text-ink-soft",
};

export function Badge({
  children,
  variant = "neutral",
  className,
  dotColor,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dotColor?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 text-xs font-medium leading-none",
        variants[variant],
        className,
      )}
    >
      {dotColor ? (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}
