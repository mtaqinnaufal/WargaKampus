import { CategoryIcon } from "@/components/category-icon";
import { cn, categoryColor } from "@/lib/utils";

export function CategoryArt({
  slug,
  name,
  className,
  label,
}: {
  slug: string;
  name: string;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-line bg-surface",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{ backgroundColor: categoryColor(slug) }}
        aria-hidden="true"
      />
      <div className="grid-paper absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: categoryColor(slug) }}
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] text-ink-soft">{name}</span>
        </div>
        <CategoryIcon
          slug={slug}
          className="h-10 w-10 text-ink"
        />
        {label ? (
          <p className="mt-3 max-w-[22ch] text-xs leading-relaxed text-ink-soft">{label}</p>
        ) : null}
      </div>
    </div>
  );
}
