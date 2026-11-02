// Place detail page (?slug=<slug>).
// Ported from src/app/(app)/tempat/[slug]/page.tsx (+ places/place-actions.tsx).
import { initPage, mainEl } from "../page-common.js";
import { SITE, url } from "../config.js";
import {
  getPlaceBySlug,
  getPlacePhotos,
  getPlaceReviews,
  isPlaceSaved,
} from "../api/places.js";
import { createPlaceMap } from "../components/map.js";
import {
  mountPlaceMediaForm,
  mountReportForm,
  mountReviewForm,
  mountSavePlaceButton,
} from "../components/forms.js";
import {
  avatar,
  badge,
  buttonClass,
  emptyState,
  starRating,
  statusBadge,
} from "../components/ui.js";
import { categoryArt, categoryIcon } from "../components/category.js";
import { icon, refreshIcons } from "../components/icons.js";
import { escapeHtml, formatDistance, formatPriceRange, relativeTime } from "../utils.js";

function sourceNote(place) {
  if (place.source === "osm") {
    return "Data awal berasal dari OpenStreetMap. Harga, fasilitas, dan jam buka adalah perkiraan yang perlu diverifikasi komunitas.";
  }
  if (place.source === "user") {
    return place.status === "verified"
      ? "Tempat ini ditambahkan oleh komunitas dan sudah diverifikasi admin. Harga dan fasilitas tetap bisa berubah."
      : "Tempat ini ditambahkan oleh komunitas. Data menunggu verifikasi admin sebelum tampil untuk semua orang.";
  }
  return "Data contoh untuk mode demo.";
}

function notFoundHtml(message) {
  return `<div class="container-page py-16">
    <p class="font-mono text-[11px] text-muted">404</p>
    <h1 class="mt-2 max-w-[24ch] font-display text-3xl font-bold leading-tight sm:text-4xl">Tempat ini tidak ditemukan.</h1>
    <p class="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">${escapeHtml(message)}</p>
    <div class="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
      <a href="${url("/jelajah")}" class="underline decoration-signal decoration-2 underline-offset-4">Jelajah</a>
      <a href="${url("/")}" class="underline decoration-signal decoration-2 underline-offset-4">Beranda</a>
    </div>
  </div>`;
}

function reviewHtml(review) {
  const authorName = review.author?.name ?? "Pengguna";
  const body = review.body
    ? `<p class="prose-kp mt-2 text-sm leading-relaxed text-ink-soft">${escapeHtml(review.body)}</p>`
    : "";
  const photoGrid =
    review.photos.length > 0
      ? `<div class="mt-3 grid grid-cols-3 gap-2">${review.photos
          .map(
            (photo, index) =>
              `<a href="${escapeHtml(photo)}" target="_blank" rel="noreferrer" class="relative aspect-square overflow-hidden rounded-lg border border-line bg-paper-deep"><img src="${escapeHtml(
                photo,
              )}" alt="Foto ulasan ${escapeHtml(authorName)} ${index + 1}" loading="lazy" class="h-full w-full object-cover"></a>`,
          )
          .join("")}</div>`
      : "";

  return `<article class="border-b border-line py-5">
    <div class="flex gap-3">
      ${avatar({ name: authorName, src: review.author?.avatar_url, size: "sm", decorative: true })}
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="text-sm font-medium text-ink">${escapeHtml(authorName)}</span>
          ${starRating(review.rating, { showCount: false })}
          <time datetime="${escapeHtml(review.created_at)}" class="text-xs text-muted">${escapeHtml(
            relativeTime(review.created_at),
          )}</time>
        </div>
        ${body}
        ${photoGrid}
      </div>
    </div>
  </article>`;
}

async function init() {
  const pathMatch = window.location.pathname.match(/\/tempat\/([^/]+)\/?$/);
  const slug =
    (pathMatch ? decodeURIComponent(pathMatch[1]) : null) ||
    new URLSearchParams(window.location.search).get("slug");
  const { current } = await initPage();

  if (!slug) {
    mainEl().innerHTML = notFoundHtml(
      "Alamat tempat tidak lengkap, jadi halaman ini tidak bisa dibuka.",
    );
    refreshIcons();
    return;
  }

  const place = await getPlaceBySlug(slug);
  const canSee =
    Boolean(place) &&
    (place.status === "verified" ||
      current.profile?.role === "admin" ||
      current.profile?.id === place.created_by);

  if (!place || !canSee) {
    mainEl().innerHTML = notFoundHtml(
      "Tautannya mungkin salah, tempat sudah dipindahkan, atau masih menunggu verifikasi admin.",
    );
    refreshIcons();
    return;
  }

  const media = new URLSearchParams(window.location.search).get("media");
  const [photos, reviews, saved] = await Promise.all([
    getPlacePhotos(place.id),
    getPlaceReviews(place.id),
    current.profile ? isPlaceSaved(current.profile.id, place.id) : Promise.resolve(false),
  ]);

  const banner = photos.find((photo) => photo.caption === "banner");
  const pricelist = photos.find((photo) => photo.caption === "pricelist");
  const gallery = photos.filter(
    (photo) => photo.caption !== "banner" && photo.caption !== "pricelist",
  );
  const canManageMedia = Boolean(
    current.profile &&
      (current.profile.role === "admin" ||
        current.profile.id === place.created_by ||
        current.profile.id === place.owner_id),
  );

  const directionsUrl = `https://www.openstreetmap.org/directions?from=&to=${place.latitude}%2C${place.longitude}`;
  const isPending = place.status === "pending";
  const isDemo = Boolean(current.isDemo);
  const name = escapeHtml(place.name);

  const bannerHtml = banner
    ? `<div class="relative aspect-[16/8] overflow-hidden rounded-xl border border-line bg-paper-deep">
        <img src="${escapeHtml(banner.image_url)}" alt="Banner ${name}" loading="lazy" class="h-full w-full object-cover">
      </div>`
    : categoryArt({
        slug: place.category.slug,
        name: place.category.name,
        className: "h-48",
        label: "Banner usaha belum diunggah. Data awal dari OpenStreetMap.",
      });

  const facilitiesHtml =
    place.facilities.length > 0
      ? `<div class="mt-4 flex flex-wrap gap-2">${place.facilities
          .map((facility) => badge(escapeHtml(facility), { variant: "outline" }))
          .join("")}</div>`
      : "";

  const galleryHtml =
    gallery.length > 0
      ? `<section class="mt-8" aria-labelledby="place-gallery-title">
          <div class="flex items-end justify-between gap-3">
            <h2 id="place-gallery-title" class="font-display text-2xl font-semibold">Foto tempat</h2>
            <span class="font-mono text-[11px] text-muted">${gallery.length} foto</span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            ${gallery
              .map(
                (photo, index) =>
                  `<a href="${escapeHtml(photo.image_url)}" target="_blank" rel="noreferrer" class="group relative aspect-square overflow-hidden rounded-lg border border-line bg-paper-deep"><img src="${escapeHtml(
                    photo.image_url,
                  )}" alt="Foto ${name} ${index + 1}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"></a>`,
              )
              .join("")}
          </div>
        </section>`
      : "";

  const reviewsHtml =
    reviews.length > 0
      ? `<div>${reviews.map(reviewHtml).join("")}</div>`
      : emptyState({
          title: "Belum ada ulasan",
          description:
            "Kalau kamu sudah pernah datang, tulis hal yang paling berguna: harga, porsi, suasana, atau jam ramai.",
          className: "mt-5",
        });

  const reviewAreaHtml = current.profile
    ? `<div data-review-form></div>`
    : `<div class="mt-6 border-t border-line pt-5 text-sm text-muted">
        <a href="${url(`/masuk?next=/tempat/${place.slug}`)}" class="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2">Masuk</a>
        untuk menulis ulasan.
      </div>`;

  const pricelistHtml = pricelist
    ? `<section class="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)]" aria-labelledby="pricelist-title">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 id="pricelist-title" class="font-display text-xl font-semibold">Pricelist</h2>
            <p class="mt-1 text-xs leading-relaxed text-muted">Harga terbaru dari pemilik usaha.</p>
          </div>
          <a href="${escapeHtml(pricelist.image_url)}" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1 text-xs font-semibold text-ink underline underline-offset-2">Buka ${icon(
            "external-link",
            "h-3 w-3",
          )}</a>
        </div>
        <a href="${escapeHtml(pricelist.image_url)}" target="_blank" rel="noreferrer" class="mt-3 block overflow-hidden rounded-lg border border-line bg-paper-deep">
          <div class="relative aspect-[4/5]">
            <img src="${escapeHtml(pricelist.image_url)}" alt="Pricelist ${name}" loading="lazy" class="h-full w-full object-cover">
          </div>
        </a>
      </section>`
    : "";

  const root = mainEl();
  root.innerHTML = `<div class="container-page py-6 lg:py-8">
    <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-1.5 text-xs text-muted">
      <a href="${url("/jelajah")}" class="hover:text-ink">Jelajah</a>
      <span aria-hidden="true">/</span>
      <a href="${url(`/jelajah?kategori=${place.category.slug}`)}" class="hover:text-ink">${escapeHtml(
        place.category.name,
      )}</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink">${name}</span>
    </nav>

    ${
      isPending
        ? `<div class="mt-4 border border-signal bg-signal/20 px-3 py-2 text-sm text-ink" role="status">Tempat ini masih menunggu verifikasi admin. Hanya kamu dan admin yang bisa melihatnya.</div>`
        : ""
    }

    ${
      media === "ok"
        ? `<div class="mt-4 border border-verify/30 bg-verify/10 px-3 py-2 text-sm text-verify" role="status">Media usaha berhasil diunggah.</div>`
        : ""
    }

    ${
      media === "error"
        ? `<div class="mt-4 border border-live/30 bg-live/10 px-3 py-2 text-sm text-live" role="alert">Tempat sudah tersimpan, tetapi media gagal diunggah. Coba unggah lagi dari panel media di bawah.</div>`
        : ""
    }

    <header class="mt-5 grid gap-6 border-b border-line pb-8 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          ${badge(`${categoryIcon(place.category.slug, "h-3.5 w-3.5")}${escapeHtml(place.category.name)}`, {
            variant: "outline",
          })}
          ${statusBadge(place.status)}
          ${place.source === "osm" ? badge("OpenStreetMap", { variant: "neutral" }) : ""}
        </div>

        <h1 class="mt-3 max-w-[20ch] font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl">${name}</h1>

        <p class="mt-3 flex items-start gap-2 text-sm text-muted">
          ${icon("map-pin", "mt-0.5 h-4 w-4 shrink-0")}
          ${escapeHtml(place.address)}
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          ${starRating(place.rating_avg, { count: place.review_count })}
          <span class="text-sm text-ink-soft">${escapeHtml(
            formatPriceRange(place.price_min, place.price_max),
          )}</span>
          <span class="text-sm text-muted">${escapeHtml(formatDistance(place.distance_km))} dari kampus</span>
          <span class="text-sm text-muted">${escapeHtml(
            place.open_hours.note ?? "Jam buka belum diverifikasi",
          )}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-start gap-2 lg:justify-end">
        <div data-save-place></div>
        <a href="${escapeHtml(directionsUrl)}" target="_blank" rel="noreferrer" class="${buttonClass({
          variant: "primary",
          size: "md",
        })}">${icon("navigation", "h-4 w-4")} Arah</a>
      </div>
    </header>

    <div class="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        ${bannerHtml}

        <section class="mt-8" aria-labelledby="about-title">
          <h2 id="about-title" class="font-display text-2xl font-semibold">Tentang tempat</h2>
          <p class="prose-kp mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink-soft">${escapeHtml(
            place.description,
          )}</p>
          ${facilitiesHtml}
        </section>

        ${galleryHtml}

        <section class="mt-10" aria-labelledby="reviews-title">
          <div class="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
            <h2 id="reviews-title" class="font-display text-2xl font-semibold">Kata mahasiswa</h2>
            <span class="font-mono text-[11px] text-muted">${reviews.length} ulasan</span>
          </div>
          ${reviewsHtml}
          ${reviewAreaHtml}
        </section>
      </div>

      <aside aria-label="Informasi tempat" class="space-y-6">
        <div class="relative isolate h-56 overflow-hidden rounded-md border border-line bg-paper-deep" role="region" aria-label="Lokasi ${name}">
          <div data-place-map class="h-full w-full"></div>
        </div>

        ${pricelistHtml}

        ${canManageMedia ? `<div data-media-form></div>` : ""}

        <section class="border-t border-line pt-4">
          <h2 class="font-display text-xl font-semibold">Info tempat</h2>
          <dl class="mt-3 space-y-2.5 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Kategori</dt>
              <dd class="text-right text-ink">${escapeHtml(place.category.name)}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Kisaran harga</dt>
              <dd class="text-right text-ink">${escapeHtml(
                formatPriceRange(place.price_min, place.price_max),
              )}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Jarak dari kampus</dt>
              <dd class="text-right text-ink">${escapeHtml(formatDistance(place.distance_km))}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Jam buka</dt>
              <dd class="text-right text-ink">${escapeHtml(
                place.open_hours.note ?? "Belum diverifikasi",
              )}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Koordinat</dt>
              <dd class="text-right font-mono text-xs text-ink">${place.latitude.toFixed(
                5,
              )}, ${place.longitude.toFixed(5)}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Sumber</dt>
              <dd class="text-right text-ink">${
                place.source === "osm" ? "OpenStreetMap" : place.source === "user" ? "Komunitas" : "Demo"
              }</dd>
            </div>
          </dl>
        </section>

        <section class="border-t border-line pt-4">
          <h2 class="font-display text-xl font-semibold">Catatan data</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">${escapeHtml(sourceNote(place))}</p>
          ${
            place.osm_id
              ? `<a href="https://www.openstreetmap.org/${escapeHtml(place.osm_id)}" target="_blank" rel="noreferrer" class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline underline-offset-2">Lihat di OpenStreetMap ${icon(
                  "external-link",
                  "h-3 w-3",
                )}</a>`
              : ""
          }
          <p class="mt-3 font-mono text-[10px] text-muted">${escapeHtml(SITE.osmAttribution)}</p>
        </section>

        <div data-report-form></div>
      </aside>
    </div>
  </div>`;

  refreshIcons();

  mountSavePlaceButton(root.querySelector("[data-save-place]"), {
    placeId: place.id,
    initialSaved: saved,
  });

  if (current.profile) {
    mountReviewForm(root.querySelector("[data-review-form]"), {
      placeId: place.id,
      slug: place.slug,
      isDemo,
    });
  }

  mountReportForm(root.querySelector("[data-report-form]"), { placeId: place.id, isDemo });

  if (canManageMedia) {
    window.__placeSlug = place.slug;
    mountPlaceMediaForm(root.querySelector("[data-media-form]"), { placeId: place.id, isDemo });
  }

  const mapEl = root.querySelector("[data-place-map]");
  if (mapEl) {
    createPlaceMap(mapEl, { places: [place], interactive: false, fitToPlaces: true });
  }

  refreshIcons();
}

init();
