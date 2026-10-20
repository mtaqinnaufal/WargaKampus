import Image from "next/image";
import { cn, initials } from "@/lib/utils";

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
  decorative = false,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
  decorative?: boolean;
}) {
  const dimension = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 }[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={decorative ? "" : name}
        width={dimension}
        height={dimension}
        className={cn(
          "shrink-0 rounded-full border border-line object-cover",
          sizes[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-line bg-paper-deep font-mono font-semibold text-ink",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
