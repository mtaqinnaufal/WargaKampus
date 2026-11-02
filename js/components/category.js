// Category icon + art helpers, ported from category-icon.tsx and category-art.tsx.
import { categoryColor, escapeHtml } from "../utils.js";
import { icon } from "./icons.js";

const ICON_BY_SLUG = {
  makan: "utensils",
  nongkrong: "armchair",
  nugas: "laptop",
  laundry: "washing-machine",
  fotokopi: "printer",
  sembako: "shopping-basket",
  kesehatan: "heart-pulse",
  hiburan: "ticket",
};

export function categoryIcon(slug, className = "h-4 w-4") {
  return icon(ICON_BY_SLUG[slug] ?? "map-pin", className);
}

export function categoryArt({ slug, name, className = "", label, iconClass = "h-10 w-10 text-ink" } = {}) {
  const color = categoryColor(slug);
  return `<div class="relative overflow-hidden rounded-md border border-line bg-surface ${className}">
    <div class="absolute inset-0 opacity-[0.16]" style="background-color:${color}" aria-hidden="true"></div>
    <div class="grid-paper absolute inset-0 opacity-30" aria-hidden="true"></div>
    <div class="relative flex h-full flex-col justify-between p-4">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" style="background-color:${color}" aria-hidden="true"></span>
        <span class="font-mono text-[11px] text-ink-soft">${escapeHtml(name)}</span>
      </div>
      ${categoryIcon(slug, iconClass)}
      ${label ? `<p class="mt-3 max-w-[22ch] text-xs leading-relaxed text-ink-soft">${escapeHtml(label)}</p>` : ""}
    </div>
  </div>`;
}
