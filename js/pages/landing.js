// Landing page — ported from src/app/page.tsx.
// The app top bar and site footer are mounted by initPage()/the shell, not here.
import { initPage, mainEl, showError } from "../page-common.js";
import { refreshIcons, icon } from "../components/icons.js";
import { createPlaceMap } from "../components/map.js";
import { landingFeed, placeCarousel, bindCarousels } from "../components/cards.js";
import { buttonClass, badge, starRating } from "../components/ui.js";
import { getPlaces } from "../api/places.js";
import { getPosts } from "../api/posts.js";
import { SITE, url } from "../config.js";
import { escapeHtml, formatPriceRange } from "../utils.js";

const { current, campus } = await initPage();

const byRank = (a, b) => b.rating_avg - a.rating_avg || b.review_count - a.review_count;

const STEPS = [
  {
    number: "01",
    title: "Cari di peta",
    body: "Filter kategori, harga, dan jarak. Pin menunjukkan tempat yang sudah dicek.",
    icon: "map-pin",
  },
  {
    number: "02",
    title: "Baca kata mahasiswa",
    body: "Lihat pengalaman, foto, dan harga terbaru dari orang yang sudah datang.",
    icon: "message-square",
  },
  {
    number: "03",
    title: "Tambah yang belum ada",
    body: "Tempel pin, isi info, lalu admin verifikasi. Kontribusimu membantu yang lain.",
    icon: "plus",
  },
];

const stepsHtml = STEPS.map(
  (step) => `<li class="border-t border-ink/30 pt-4">
    <div class="flex items-center justify-between">
      <span class="font-mono text-xs text-muted">${step.number}</span>
      ${icon(step.icon, "h-4 w-4 text-ink")}
    </div>
    <h3 class="mt-6 font-display text-xl font-semibold">${escapeHtml(step.title)}</h3>
    <p class="mt-2 text-sm leading-relaxed text-muted">${escapeHtml(step.body)}</p>
  </li>`,
).join("");

try {
  const [allPlaces, posts] = await Promise.all([
    getPlaces(),
    getPosts({ campusId: campus?.id ?? null, userId: current.user?.id ?? null, limit: 4 }),
  ]);

  const places = [...allPlaces].sort(byRank).slice(0, 8);

  const carouselPlaces = [...allPlaces]
    .sort(byRank)
    .filter(
      (place, index, list) =>
        list.findIndex((item) => item.category.slug === place.category.slug) === index,
    )
    .slice(0, 6);

  const featured = places[0];
  const contributors = new Set(posts.map((post) => post.author?.id).filter(Boolean)).size;
  const featuredDistance =
    featured?.distance_km === null || featured?.distance_km === undefined
      ? ""
      : `${featured.distance_km.toFixed(1)} km`;

  const featuredOverlay = featured
    ? `<a href="${url(`/tempat/${featured.slug}`)}" class="absolute bottom-4 left-4 right-4 z-[500] rounded-md border border-line bg-surface/95 p-3 shadow-lift backdrop-blur sm:right-auto sm:w-[300px]">
              <div class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true"></span>
                <span class="font-mono text-[10px] text-muted">${escapeHtml(featured.category.name)}</span>
                <span class="ml-auto font-mono text-[10px] text-muted">${escapeHtml(featuredDistance)}</span>
              </div>
              <p class="mt-1 font-display text-lg font-semibold leading-tight">${escapeHtml(featured.name)}</p>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                ${starRating(featured.rating_avg, { count: featured.review_count })}
                <span class="text-[11px] text-muted">${escapeHtml(formatPriceRange(featured.price_min, featured.price_max))}</span>
              </div>
              <span class="mt-2 inline-flex items-center gap-1 text-xs font-semibold">Lihat tempat ${icon("arrow-right", "h-3.5 w-3.5")}</span>
            </a>`
    : "";

  const main = mainEl();
  main.innerHTML = `
    <section class="container-page grid gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:py-16">
      <div class="reveal">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
          <span class="flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full bg-live" aria-hidden="true"></span>
            ${escapeHtml(SITE.campusShort)} · Duri Kosambi
          </span>
          <span aria-hidden="true">/</span>
          <span>Radius 5 km</span>
          <span aria-hidden="true">/</span>
          <span>Data komunitas</span>
        </div>

        <h1 class="mt-5 max-w-[15ch] font-display text-[clamp(3.2rem,7.4vw,6.4rem)] font-bold leading-[0.9] tracking-[-0.055em] text-ink">
          Tahu Tempat Sebelum Berangkat
        </h1>

        <p class="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-soft">
          Temukan makan, nugas, nongkrong, laundry, dan kebutuhan harian yang benar-benar
          masuk akal di sekitar ITPLN. Dikurasi oleh mahasiswa, bukan iklan.
        </p>

        <form action="${url("/jelajah")}" method="get" class="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
          <label for="hero-search" class="sr-only">Cari tempat</label>
          <input
            id="hero-search"
            name="q"
            type="search"
            placeholder="Cari tempat, kategori, atau kebutuhan"
            class="h-11 w-full rounded-sm border border-line bg-surface px-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-signal/70"
          />
          <button type="submit" class="${buttonClass({ variant: "primary", size: "md" })}">Cari tempat</button>
        </form>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <a href="${url("/jelajah")}" class="${buttonClass({ variant: "secondary", size: "md" })}">
            Buka peta
            ${icon("arrow-right", "h-4 w-4")}
          </a>
          <a href="${url("/linimasa")}" class="${buttonClass({ variant: "outline", size: "md" })}">
            Lihat linimasa
          </a>
        </div>

        <dl class="mt-8 grid max-w-lg grid-cols-3 divide-x divide-line border-y border-line">
          <div class="py-4 pr-4">
            <dt class="text-xs text-muted">Tempat terverifikasi</dt>
            <dd class="mt-1 font-mono text-2xl font-semibold text-ink">${allPlaces.length}</dd>
          </div>
          <div class="px-4 py-4">
            <dt class="text-xs text-muted">Cerita minggu ini</dt>
            <dd class="mt-1 font-mono text-2xl font-semibold text-ink">${posts.length}</dd>
          </div>
          <div class="py-4 pl-4">
            <dt class="text-xs text-muted">Kontributor</dt>
            <dd class="mt-1 font-mono text-2xl font-semibold text-ink">${contributors}</dd>
          </div>
        </dl>

        <p class="mt-4 max-w-[54ch] text-xs leading-relaxed text-muted">
          Data awal dari OpenStreetMap. Harga, fasilitas, dan jam buka perlu dicek ulang oleh
          komunitas.
        </p>
      </div>

      <div class="reveal reveal-delay-2">
        <div class="relative">
          <div class="pointer-events-none absolute -inset-3 rounded-[26px] bg-signal/10 blur-2xl animate-pulse motion-reduce:animate-none" aria-hidden="true"></div>
          <div class="relative rounded-xl border border-line-strong/70 bg-surface/70 p-2 shadow-lift transition-transform duration-500 ease-out hover:-translate-y-1">
            <div class="overflow-hidden rounded-lg border border-line bg-surface">
              <div class="flex items-center justify-between border-b border-line px-4 py-3">
                <span class="inline-flex items-center gap-2 font-mono text-[11px] text-ink-soft">
                  <span class="relative flex h-1.5 w-1.5">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-50 motion-reduce:animate-none"></span>
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-live"></span>
                  </span>
                  Peta sekitar ${escapeHtml(SITE.campusShort)}
                </span>
                ${badge("Radius 5 km", { variant: "signal" })}
              </div>

              <div class="relative">
                <div
                  class="relative isolate overflow-hidden rounded-none border-0 bg-paper-deep h-[320px] sm:h-[360px] lg:h-[clamp(340px,46vh,460px)]"
                  role="region"
                  aria-label="Pratinjau peta tempat di sekitar Institut Teknologi PLN"
                >
                  <div class="h-full w-full" data-map></div>
                </div>

                ${featuredOverlay}
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2">
                <span class="font-mono text-[10px] text-muted">${escapeHtml(SITE.osmAttribution)}</span>
                <span class="text-[10px] text-muted">Pin bisa dipakai untuk melihat detail.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-line bg-surface/45">
      <div class="reveal container-page grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <div>
          <h2 class="max-w-[15ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
            Tiga langkah, tanpa ribet.
          </h2>
          <p class="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted">
            WargaKampus dibuat untuk keputusan kecil yang terjadi terus-menerus: mau makan di
            mana, nugas di mana, dan laundry di mana.
          </p>
        </div>

        <ol class="grid gap-6 sm:grid-cols-3">
          ${stepsHtml}
        </ol>
      </div>
    </section>

    ${landingFeed(posts, contributors)}

    <section class="border-t border-line">
      <div class="reveal container-page py-12 lg:py-16">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 class="font-display text-3xl font-bold leading-tight sm:text-4xl">
              Tempat yang layak dicoba.
            </h2>
            <p class="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted">
              Pilihan awal dari data OpenStreetMap. Setiap tempat punya alamat, jarak, dan
              catatan yang bisa kamu cek sebelum berangkat.
            </p>
          </div>
          <a href="${url("/jelajah")}" class="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">
            Lihat semua tempat
            ${icon("arrow-right", "h-4 w-4")}
          </a>
        </div>

        <div class="mt-8">
          ${placeCarousel(carouselPlaces)}
          <p class="mt-3 font-mono text-[10px] leading-relaxed text-muted">
            Foto kategori adalah ilustrasi, bukan foto tempat.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-ink text-surface">
      <div class="container-page relative overflow-hidden py-12 lg:py-16">
        <div class="grid-paper absolute inset-0 opacity-[0.08]" aria-hidden="true"></div>
        <div class="reveal relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h2 class="max-w-[16ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
              Punya tempat yang belum ada di peta?
            </h2>
            <p class="mt-3 max-w-[52ch] text-sm leading-relaxed text-surface/85">
              Tempel pin, isi nama dan kategori, lalu kirim. Admin akan mengecek sebelum
              tempat tampil untuk semua orang.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 lg:justify-end">
            <a href="${url("/tempat/baru")}" class="${buttonClass({ variant: "primary", size: "lg" })}">
              ${icon("plus", "h-4 w-4")}
              Tambah tempat
            </a>
            <a href="${url("/jelajah")}" class="${buttonClass({
              variant: "outline",
              size: "lg",
              className: "border-surface text-surface hover:bg-surface/10",
            })}">
              Buka peta
            </a>
          </div>
        </div>
        <div class="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-surface/80">
          <span class="flex items-center gap-1.5">
            ${icon("check-circle-2", "h-3.5 w-3.5")}
            Tempat baru diverifikasi admin
          </span>
          <span class="flex items-center gap-1.5">
            ${icon("users", "h-3.5 w-3.5")}
            Komunitas mahasiswa ITPLN
          </span>
        </div>
      </div>
    </section>`;

  const mapNode = main.querySelector("[data-map]");
  if (mapNode) {
    createPlaceMap(mapNode, {
      places: places.slice(0, 8),
      interactive: false,
      fitToPlaces: true,
    });
  }

  bindCarousels(main);
  refreshIcons();
} catch (error) {
  showError(mainEl(), escapeHtml(error?.message ?? "Coba muat ulang halaman ini."));
}
