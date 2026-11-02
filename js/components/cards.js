// Content cards + carousels, ported from places/* and feed/*.
import { categoryColor, cx, escapeHtml, formatDistance, formatPriceRange, relativeTime } from "../utils.js";
import { POST_CATEGORIES, ROLE_LABELS, url } from "../config.js";
import { avatar, badge, starRating, statusBadge } from "./ui.js";
import { categoryArt } from "./category.js";
import { icon } from "./icons.js";

const CATEGORY_IMAGES = {
  makan: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  nongkrong: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
  nugas: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
  laundry: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80",
  fotokopi: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  sembako: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  kesehatan: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
  hiburan: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
};

function dot(slug) {
  return `<span class="h-1.5 w-1.5 rounded-full" style="background-color:${categoryColor(slug)}" aria-hidden="true"></span>`;
}

export function placeGridCard(place, { className = "" } = {}) {
  return `<a href="${url(`/tempat/${place.slug}`)}" class="${cx(
    "group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-ink/30 hover:shadow-lift",
    className,
  )}">
    ${categoryArt({ slug: place.category.slug, name: place.category.name, className: "h-36 rounded-none border-0" })}
    <div class="flex flex-1 flex-col p-4">
      <div class="flex items-center gap-2 text-[10px] text-muted">${dot(place.category.slug)}<span class="font-mono">${escapeHtml(
        place.category.name,
      )}</span><span aria-hidden="true">·</span><span>${escapeHtml(formatDistance(place.distance_km))}</span></div>
      ${place.status !== "verified" ? `<div class="mt-2">${statusBadge(place.status)}</div>` : ""}
      <h3 class="mt-1.5 font-display text-lg font-semibold leading-tight text-ink">${escapeHtml(place.name)}</h3>
      <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">${escapeHtml(place.description)}</p>
      <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">${starRating(place.rating_avg, {
        count: place.review_count,
      })}<span class="text-[11px] text-muted">${escapeHtml(formatPriceRange(place.price_min, place.price_max))}</span></div>
    </div>
  </a>`;
}

export function placeRow(place, { active = false } = {}) {
  return `<a href="${url(`/tempat/${place.slug}`)}" data-place-id="${escapeHtml(place.id)}" class="${cx(
    "block border-b border-line px-4 py-4 transition-colors",
    active ? "bg-signal/15" : "hover:bg-surface",
  )}">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">${dot(place.category.slug)}<span class="font-mono text-[10px] text-muted">${escapeHtml(
          place.category.name,
        )}</span><span class="text-[10px] text-muted">·</span><span class="text-[10px] text-muted">${escapeHtml(
          formatDistance(place.distance_km),
        )}</span></div>
        <h3 class="mt-1 font-display text-lg font-semibold leading-tight text-ink">${escapeHtml(place.name)}</h3>
        <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">${escapeHtml(place.description)}</p>
        <div class="mt-2 flex flex-wrap items-center gap-3">${starRating(place.rating_avg, {
          count: place.review_count,
        })}<span class="text-xs text-muted">${escapeHtml(formatPriceRange(place.price_min, place.price_max))}</span></div>
      </div>
      <div class="hidden shrink-0 text-right text-[10px] leading-relaxed text-muted sm:block">${place.facilities
        .slice(0, 3)
        .map((f) => `<div>${escapeHtml(f)}</div>`)
        .join("")}</div>
    </div>
  </a>`;
}

export function placeTile(place, { featured = false, className = "" } = {}) {
  return `<a href="${url(`/tempat/${place.slug}`)}" class="${cx(
    "group block border-t border-line py-4 transition-colors hover:bg-surface/70",
    className,
  )}">
    <div class="${cx("grid gap-4", featured ? "sm:grid-cols-[190px_1fr]" : "grid-cols-[88px_1fr]")}">
      ${categoryArt({
        slug: place.category.slug,
        name: place.category.name,
        className: featured ? "h-40 sm:h-44" : "h-24",
        label: featured ? "Foto komunitas menyusul" : undefined,
      })}
      <div class="flex min-w-0 flex-col justify-between">
        <div>
          <div class="flex items-center gap-2">${dot(place.category.slug)}<span class="font-mono text-[10px] text-muted">${escapeHtml(
            place.category.name,
          )}</span><span class="ml-auto text-[11px] text-muted">${escapeHtml(formatDistance(place.distance_km))}</span></div>
          <h3 class="${cx(
            "mt-1 font-display font-semibold leading-tight text-ink",
            featured ? "text-2xl sm:text-3xl" : "text-lg",
          )}">${escapeHtml(place.name)}</h3>
          <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">${escapeHtml(place.description)}</p>
        </div>
        <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-3">${starRating(place.rating_avg, {
            count: place.review_count,
          })}<span class="text-xs text-muted">${escapeHtml(formatPriceRange(place.price_min, place.price_max))}</span></div>
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-ink">Lihat ${icon("arrow-up-right", "h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5")}</span>
        </div>
      </div>
    </div>
  </a>`;
}

export function placeCarousel(places) {
  const cards = places
    .map((place) => {
      const image = CATEGORY_IMAGES[place.category.slug];
      const art = categoryArt({
        slug: place.category.slug,
        name: place.category.name,
        className: "h-full rounded-none border-0",
      });
      return `<a href="${url(`/tempat/${place.slug}`)}" draggable="false" data-carousel-card class="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70 sm:w-[320px]">
        <div class="relative aspect-[4/3] overflow-hidden bg-paper-deep">
          <div class="pointer-events-none absolute inset-0">${art}</div>
          <img src="${image}" alt="Ilustrasi kategori ${escapeHtml(place.category.name)}" draggable="false" loading="lazy" class="relative h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" onerror="this.remove()">
          <div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" aria-hidden="true"></div>
          <div class="absolute left-3 top-3">${badge(place.category.name, { variant: "signal" })}</div>
          <div class="absolute bottom-3 left-3 right-3">
            <p class="font-display text-lg font-semibold leading-tight text-surface sm:text-xl">${escapeHtml(place.name)}</p>
            <p class="mt-1 font-mono text-[10px] text-surface/80">${escapeHtml(
              formatDistance(place.distance_km),
            )} · ${escapeHtml(formatPriceRange(place.price_min, place.price_max))}</p>
          </div>
        </div>
        <div class="flex flex-1 flex-col p-3">
          <div class="flex items-center justify-between gap-2">${starRating(place.rating_avg, {
            count: place.review_count,
          })}${icon("arrow-up-right", "h-4 w-4 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5")}</div>
          <p class="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">${escapeHtml(place.description)}</p>
        </div>
      </a>`;
    })
    .join("");

  return `<div data-carousel>
    <div class="flex items-center justify-between gap-3">
      <p class="font-mono text-[10px] text-muted">${places.length} tempat · geser untuk lihat lainnya</p>
      <div class="flex gap-2">
        <button type="button" data-carousel-prev aria-label="Geser ke kiri" class="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35">${icon(
          "chevron-left",
          "h-4 w-4",
        )}</button>
        <button type="button" data-carousel-next aria-label="Geser ke kanan" class="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35">${icon(
          "chevron-right",
          "h-4 w-4",
        )}</button>
      </div>
    </div>
    <div data-carousel-track tabindex="0" role="group" aria-label="Daftar tempat, dapat digeser ke kiri dan kanan" class="no-scrollbar mt-4 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70">${cards}</div>
  </div>`;
}

export function landingFeed(posts, contributors) {
  const cardsHtml =
    posts.length > 0
      ? `<div class="flex items-center justify-between gap-3">
          <p class="font-mono text-[10px] text-muted">${posts.length} cerita · geser untuk lihat lainnya</p>
          <div class="flex gap-2">
            <button type="button" data-carousel-prev aria-label="Geser cerita ke kiri" class="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35">${icon(
              "chevron-left",
              "h-4 w-4",
            )}</button>
            <button type="button" data-carousel-next aria-label="Geser cerita ke kanan" class="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35">${icon(
              "chevron-right",
              "h-4 w-4",
            )}</button>
          </div>
        </div>
        <div data-carousel-track role="group" tabindex="0" aria-label="Daftar cerita, dapat digeser ke kiri dan kanan" class="no-scrollbar mt-3 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70">${posts
          .map((post, index) => landingPostCard(post, { lead: index === 0 }))
          .join("")}</div>`
      : `<div class="rounded-lg border border-dashed border-line-strong bg-surface/65 px-6 py-10 text-center text-sm text-muted">Belum ada cerita. Jadi yang pertama menulis di linimasa.</div>`;

  return `<section data-carousel class="relative overflow-hidden border-y border-line bg-[linear-gradient(180deg,var(--color-surface)_0%,var(--color-paper)_100%)]">
    <div class="grid-paper pointer-events-none absolute inset-0 opacity-25" aria-hidden="true"></div>
    <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/10 blur-3xl" aria-hidden="true"></div>
    <div class="container-page relative grid gap-8 py-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-14 lg:py-16">
      <div class="reveal">
        <span class="inline-flex items-center gap-2 rounded-full border border-live/20 bg-live/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-live">
          <span class="relative flex h-1.5 w-1.5"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60 motion-reduce:animate-none"></span><span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-live"></span></span>
          Linimasa komunitas
        </span>
        <h2 class="mt-5 max-w-[12ch] font-display text-3xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.9rem]">Lagi <span class="relative inline-block"><span class="absolute inset-x-0 bottom-1 h-2.5 -rotate-1 bg-signal/75" aria-hidden="true"></span><span class="relative">rame</span></span> di sekitar kampus.</h2>
        <p class="mt-4 max-w-[38ch] text-sm leading-relaxed text-muted">Info dari mahasiswa yang baru saja datang. Bukan ulasan bintang lima yang dibuat untuk algoritma.</p>
        <div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted"><span class="font-medium text-ink">${posts.length} cerita</span><span class="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true"></span><span>${contributors} kontributor</span></div>
        <a href="${url("/linimasa")}" class="group mt-6 inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-ink-soft">Buka linimasa ${icon(
          "arrow-right",
          "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
        )}</a>
      </div>
      <div class="reveal reveal-delay-2 min-w-0"><div>${cardsHtml}</div></div>
    </div>
  </section>`;
}

function landingPostCard(post, { lead = false } = {}) {
  const placeLink = post.place
    ? `<a href="${url(`/tempat/${post.place.slug}`)}" class="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-paper px-2.5 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-ink hover:text-ink">${dot(
        post.place.category.slug,
      )}<span class="truncate">${escapeHtml(post.place.name)}</span><span class="text-muted">·</span><span class="shrink-0 font-mono text-[10px] text-muted">${escapeHtml(
        post.place.category.name,
      )}</span></a>`
    : "";
  return `<article aria-label="Cerita ${escapeHtml(post.author.name)}" class="${cx(
    "group relative flex w-[286px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgba(11,26,40,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/35 hover:shadow-lift sm:w-[360px] lg:w-[380px]",
    lead && "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-1 before:bg-signal",
  )}">
    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <div class="flex items-start gap-3">
        ${avatar({ name: post.author.name, src: post.author.avatar_url, size: lead ? "md" : "sm", decorative: true })}
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-ink">${escapeHtml(post.author.name)}</p>
          <p class="mt-0.5 text-[10px] text-muted">${escapeHtml(ROLE_LABELS[post.author.role] ?? "")} · <time datetime="${escapeHtml(
            post.created_at,
          )}">${escapeHtml(relativeTime(post.created_at))}</time></p>
        </div>
        ${badge(POST_CATEGORIES[post.category] ?? "", { variant: "outline", className: "shrink-0" })}
      </div>
      <p class="prose-kp mt-3 line-clamp-4 leading-relaxed text-ink-soft ${lead ? "text-[15px]" : "text-sm"}">${escapeHtml(
        post.body,
      )}</p>
      ${placeLink}
      <div class="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
        <div class="flex items-center gap-3 text-[10px] text-muted">
          <span class="inline-flex items-center gap-1">${icon("heart", "h-3.5 w-3.5")}${post.like_count}<span class="sr-only"> suka</span></span>
          <span class="inline-flex items-center gap-1">${icon("message-circle", "h-3.5 w-3.5")}${post.comment_count}<span class="sr-only"> komentar</span></span>
        </div>
        <a href="${url(`/linimasa#post-${post.id}`)}" aria-label="Baca cerita ${escapeHtml(post.author.name)}" class="inline-flex items-center gap-1 text-xs font-semibold text-ink">Baca ${icon(
          "arrow-up-right",
          "h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
        )}</a>
      </div>
    </div>
  </article>`;
}

export function postPreview(post, { lead = false } = {}) {
  const placeLink = post.place
    ? `<a href="${url(`/tempat/${post.place.slug}`)}" class="mt-3 inline-flex max-w-full items-center gap-2 text-xs text-ink-soft hover:underline">${dot(
        post.place.category.slug,
      )}<span class="truncate">${escapeHtml(post.place.name)}</span><span class="text-muted">·</span><span class="font-mono text-[10px] text-muted">${escapeHtml(
        post.place.category.name,
      )}</span></a>`
    : "";
  const photo =
    lead && post.photos[0]
      ? `<div class="mt-4 aspect-[16/9] overflow-hidden rounded-sm border border-line bg-paper-deep"><img src="${escapeHtml(
          post.photos[0],
        )}" alt="Foto unggahan ${escapeHtml(post.author.name)}" loading="lazy" class="h-full w-full object-cover"></div>`
      : "";
  return `<article class="${cx("relative border-l border-line pl-5", lead ? "pb-8" : "py-5")}">
    <span class="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-signal" aria-hidden="true"></span>
    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted"><span class="font-medium text-ink">${escapeHtml(
      post.author.name,
    )}</span><span>·</span><time datetime="${escapeHtml(post.created_at)}">${escapeHtml(relativeTime(post.created_at))}</time>${badge(
      POST_CATEGORIES[post.category] ?? "",
      { variant: "outline" },
    )}</div>
    <p class="prose-kp mt-2 line-clamp-4 leading-relaxed text-ink-soft ${lead ? "text-[15px]" : "text-sm"}">${escapeHtml(
      post.body,
    )}</p>
    ${placeLink}
    ${photo}
    <a href="${url(`/linimasa#post-${post.id}`)}" class="mt-3 inline-flex text-xs font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2">Baca di linimasa</a>
  </article>`;
}

// Wire scroll buttons + pointer drag for every [data-carousel] inside root.
export function bindCarousels(root = document) {
  root.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    if (!track) return;

    const drag = { active: false, startX: 0, scrollLeft: 0, moved: false };

    const updateEdges = () => {
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    const scrollBy = (direction) => {
      const card = track.querySelector("[data-carousel-card]");
      const width = card ? card.offsetWidth + 16 : 336;
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      track.scrollBy({ left: direction * width, behavior });
    };

    prev?.addEventListener("click", () => scrollBy(-1));
    next?.addEventListener("click", () => scrollBy(1));
    track.addEventListener("scroll", updateEdges);
    window.addEventListener("resize", updateEdges);

    let captured = false;
    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      drag.active = true;
      drag.startX = event.clientX;
      drag.scrollLeft = track.scrollLeft;
      drag.moved = false;
    });
    track.addEventListener("pointermove", (event) => {
      if (!drag.active) return;
      const delta = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(delta) > 5) {
        drag.moved = true;
        if (!captured) {
          track.setPointerCapture(event.pointerId);
          captured = true;
          track.classList.add("cursor-grabbing", "select-none");
        }
      }
      if (drag.moved) track.scrollLeft = drag.scrollLeft - delta;
    });
    const endDrag = (event) => {
      if (!drag.active) return;
      drag.active = false;
      track.classList.remove("cursor-grabbing", "select-none");
      if (captured && track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      captured = false;
    };
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", (event) => {
      if (drag.moved) {
        event.preventDefault();
        event.stopPropagation();
        drag.moved = false;
      }
    }, true);

    updateEdges();
  });
}
