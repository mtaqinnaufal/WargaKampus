// Shared UI helpers ported from src/components/ui/* and friends.
// Each returns an HTML string; dynamic user text is escaped.
import { cx, escapeHtml, initials } from "../utils.js";
import { icon } from "./icons.js";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm font-sans font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

const BUTTON_VARIANTS = {
  primary: "border border-ink bg-signal text-ink hover:bg-signal-deep active:translate-y-px",
  secondary: "border border-ink bg-ink text-surface hover:bg-ink-soft active:translate-y-px",
  outline: "border border-ink bg-transparent text-ink hover:bg-paper-deep active:translate-y-px",
  ghost: "border border-transparent bg-transparent text-ink hover:bg-paper-deep",
  danger: "border border-live bg-live text-surface hover:bg-[#a8321d] active:translate-y-px",
};

const BUTTON_SIZES = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-[15px]",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10",
};

export function buttonClass({ variant = "primary", size = "md", className = "" } = {}) {
  return cx(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

const BADGE_VARIANTS = {
  neutral: "border-line bg-paper-deep text-ink-soft",
  signal: "border-ink/20 bg-signal text-ink",
  ink: "border-ink bg-ink text-surface",
  live: "border-live/30 bg-live/10 text-live",
  verify: "border-verify/30 bg-verify/10 text-verify",
  outline: "border-line-strong bg-transparent text-ink-soft",
};

export function badge(childrenHtml, { variant = "neutral", className = "", dotColor } = {}) {
  const dot = dotColor
    ? `<span class="h-1.5 w-1.5 rounded-full" style="background-color:${dotColor}" aria-hidden="true"></span>`
    : "";
  return `<span class="${cx(
    "inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 text-xs font-medium leading-none",
    BADGE_VARIANTS[variant],
    className,
  )}">${dot}${childrenHtml}</span>`;
}

const STATUS_MAP = {
  pending: { label: "Menunggu verifikasi", variant: "signal" },
  verified: { label: "Terverifikasi", variant: "verify" },
  rejected: { label: "Ditolak", variant: "live" },
  closed: { label: "Tutup sementara", variant: "neutral" },
};

export function statusBadge(status) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.closed;
  return badge(config.label, { variant: config.variant });
}

const AVATAR_SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};
const AVATAR_DIM = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };

export function avatar({ name, src, size = "md", className = "", decorative = false } = {}) {
  const dimension = AVATAR_DIM[size] ?? 40;
  if (src) {
    return `<img src="${escapeHtml(src)}" alt="${decorative ? "" : escapeHtml(name)}" width="${dimension}" height="${dimension}" class="${cx(
      "shrink-0 rounded-full border border-line object-cover",
      AVATAR_SIZES[size],
      className,
    )}">`;
  }
  return `<span ${decorative ? 'aria-hidden="true"' : `aria-label="${escapeHtml(name)}"`} class="${cx(
    "grid shrink-0 place-items-center rounded-full border border-line bg-paper-deep font-mono font-semibold text-ink",
    AVATAR_SIZES[size],
    className,
  )}">${escapeHtml(initials(name))}</span>`;
}

export function starRating(rating, { count, showCount = true, className = "" } = {}) {
  const rounded = Math.round(rating);
  const stars = [1, 2, 3, 4, 5]
    .map(
      (value) =>
        `<i data-lucide="star" class="${cx(
          "h-3.5 w-3.5",
          value <= rounded ? "fill-signal text-ink" : "fill-transparent text-line-strong",
        )}"></i>`,
    )
    .join("");
  const label = rating > 0 ? `${rating.toFixed(1)} dari 5 bintang` : "Belum ada rating";
  const countHtml = showCount
    ? `<span class="text-xs text-muted">${rating > 0 ? rating.toFixed(1) : "Baru"}${
        count && count > 0 ? ` (${count})` : ""
      }</span>`
    : "";
  return `<span class="${cx(
    "inline-flex items-center gap-1.5",
    className,
  )}" role="img" aria-label="${label}"><span class="flex items-center gap-0.5" aria-hidden="true">${stars}</span>${countHtml}</span>`;
}

export function ratingInput({ name = "rating", defaultValue = 5, label = "Rating" } = {}) {
  const buttons = [1, 2, 3, 4, 5]
    .map(
      (star) =>
        `<button type="button" role="radio" aria-checked="${star === defaultValue}" aria-label="${star} bintang" class="grid h-10 w-10 place-items-center rounded-sm border border-transparent hover:bg-paper-deep" data-rating="${star}">${icon(
          "star",
          "h-6 w-6 fill-transparent text-line-strong",
        )}</button>`,
    )
    .join("");
  return `<div data-rating-input>
    <span class="mb-1.5 block text-sm font-medium text-ink">${escapeHtml(label)}</span>
    <div class="flex items-center gap-1" role="radiogroup" aria-label="${escapeHtml(label)}">
      ${buttons}
      <span class="ml-2 font-mono text-sm text-muted" data-rating-value>${defaultValue}/5</span>
    </div>
    <input type="hidden" name="${escapeHtml(name)}" value="${defaultValue}">
  </div>`;
}

export function formMessage(message, { ok = false, className = "" } = {}) {
  if (!message) return "";
  return `<p role="${ok ? "status" : "alert"}" class="${cx(
    "rounded-sm border px-3 py-2 text-sm leading-relaxed",
    ok ? "border-verify/30 bg-verify/10 text-verify" : "border-live/30 bg-live/10 text-live",
    className,
  )}">${escapeHtml(message)}</p>`;
}

export function emptyState({ title, description, actionHtml = "", className = "" } = {}) {
  return `<div class="${cx(
    "rounded-md border border-dashed border-line-strong bg-surface/65 px-6 py-10 text-center",
    className,
  )}">
    <h3 class="font-display text-xl font-semibold text-ink">${escapeHtml(title)}</h3>
    <p class="mx-auto mt-2 max-w-[48ch] text-sm leading-relaxed text-muted">${escapeHtml(description)}</p>
    ${actionHtml ? `<div class="mt-5 flex justify-center">${actionHtml}</div>` : ""}
  </div>`;
}

export function fieldLabel({ htmlFor, text, hint }) {
  const hintHtml = hint ? `<span class="ml-2 font-normal text-muted">${escapeHtml(hint)}</span>` : "";
  return `<label for="${escapeHtml(htmlFor)}" class="mb-1.5 block text-sm font-medium text-ink">${escapeHtml(
    text,
  )}${hintHtml}</label>`;
}

export function fieldHint(text, id) {
  return `<p ${id ? `id="${escapeHtml(id)}"` : ""} class="mt-1.5 text-xs leading-relaxed text-muted">${escapeHtml(
    text,
  )}</p>`;
}

export const inputClass =
  "w-full rounded-sm border border-line bg-surface px-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-signal/70 disabled:cursor-not-allowed disabled:bg-paper-deep disabled:text-muted";
export const inputH = `${inputClass} h-11`;
export const textareaClass = `${inputClass} min-h-28 py-3 leading-relaxed`;
export const selectClass = `${inputClass} h-11 cursor-pointer pr-9`;
