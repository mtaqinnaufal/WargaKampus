import { cn } from "@/lib/utils";

export function FormMessage({
  message,
  ok = false,
  className,
}: {
  message?: string | null;
  ok?: boolean;
  className?: string;
}) {
  if (!message) return null;

  return (
    <p
      role={ok ? "status" : "alert"}
      className={cn(
        "rounded-sm border px-3 py-2 text-sm leading-relaxed",
        ok
          ? "border-verify/30 bg-verify/10 text-verify"
          : "border-live/30 bg-live/10 text-live",
        className,
      )}
    >
      {message}
    </p>
  );
}
