// Simpanan page — ported from src/app/(app)/simpan/page.tsx.
import { initPage, mainEl, showError } from "../page-common.js";
import { getSavedPlaces } from "../api/places.js";
import { getSavedPosts } from "../api/posts.js";
import { placeGridCard } from "../components/cards.js";
import { postCardHtml } from "../components/feed.js";
import { buttonClass, emptyState } from "../components/ui.js";
import { icon, refreshIcons } from "../components/icons.js";
import { url } from "../config.js";
import { escapeHtml } from "../utils.js";

const { current } = await initPage();

if (!current.profile) {
  window.location.assign(url("/masuk?next=/simpan"));
} else {
  try {
    const [places, posts] = await Promise.all([
      getSavedPlaces(current.profile.id),
      getSavedPosts(current.profile.id),
    ]);

    const currentUserId = current.user?.id ?? null;

    const placesHtml =
      places.length > 0
        ? `<div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              ${places.map((place) => placeGridCard(place)).join("")}
            </div>`
        : emptyState({
            title: "Belum ada tempat tersimpan",
            description:
              "Buka peta, pilih tempat yang berguna, lalu tekan Simpan di halaman tempat.",
            actionHtml: `<a href="${url(
              "/jelajah",
            )}" class="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">Buka peta</a>`,
            className: "mt-4",
          });

    const postsHtml =
      posts.length > 0
        ? `<div class="mt-4 max-w-[760px] space-y-4">
              ${posts.map((post) => postCardHtml(post, { currentUserId })).join("")}
            </div>`
        : emptyState({
            title: "Belum ada cerita tersimpan",
            description: "Di linimasa, tekan Simpan pada cerita yang ingin kamu baca lagi nanti.",
            actionHtml: `<a href="${url(
              "/linimasa",
            )}" class="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">Buka linimasa</a>`,
            className: "mt-4",
          });

    mainEl().innerHTML = `<div class="container-page py-6 lg:py-8">
      <header class="relative overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:p-6 lg:p-8">
        <div
          class="grid-paper pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal/10 blur-3xl"
          aria-hidden="true"
        ></div>
        <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              ${icon("bookmark", "h-4 w-4 text-ink")}
              <span class="font-mono text-[11px] text-muted">Koleksi pribadi</span>
            </div>
            <h1 class="mt-2 max-w-[16ch] font-display text-3xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-4xl">
              Yang kamu simpan.
            </h1>
            <p class="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted">
              Tempat dan cerita yang ingin kamu buka lagi. Simpanan hanya terlihat olehmu.
            </p>

            <dl class="mt-5 flex flex-wrap gap-3">
              <div class="min-w-28 rounded-lg border border-line bg-paper/70 px-4 py-3">
                <dt class="text-[10px] text-muted">Tempat</dt>
                <dd class="mt-1 font-mono text-2xl font-semibold text-ink">
                  ${escapeHtml(places.length)}
                </dd>
              </div>
              <div class="min-w-28 rounded-lg border border-line bg-paper/70 px-4 py-3">
                <dt class="text-[10px] text-muted">Postingan</dt>
                <dd class="mt-1 font-mono text-2xl font-semibold text-ink">
                  ${escapeHtml(posts.length)}
                </dd>
              </div>
            </dl>
          </div>

          <div class="flex flex-wrap gap-2">
            <a
              href="${url("/jelajah")}"
              class="${buttonClass({ variant: "outline", size: "md" })}"
            >
              ${icon("map", "h-4 w-4")}
              Jelajahi tempat
            </a>
            <a
              href="${url("/linimasa")}"
              class="${buttonClass({ variant: "primary", size: "md" })}"
            >
              ${icon("newspaper", "h-4 w-4")}
              Buka linimasa
            </a>
          </div>
        </div>
      </header>

      <div class="reveal">
        <section class="mt-7" aria-labelledby="saved-places-title">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="saved-places-title" class="font-display text-2xl font-semibold">
                Tempat tersimpan
              </h2>
              <p class="mt-1 text-xs text-muted">
                ${escapeHtml(places.length)} tempat di koleksimu.
              </p>
            </div>
            <a
              href="${url("/jelajah")}"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
            >
              Cari lagi
              ${icon("arrow-right", "h-4 w-4")}
            </a>
          </div>

          ${placesHtml}
        </section>
      </div>

      <div class="reveal reveal-delay-1">
        <section class="mt-10" aria-labelledby="saved-posts-title">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="saved-posts-title" class="font-display text-2xl font-semibold">
                Cerita tersimpan
              </h2>
              <p class="mt-1 text-xs text-muted">
                ${escapeHtml(posts.length)} cerita di koleksimu.
              </p>
            </div>
            <a
              href="${url("/linimasa")}"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
            >
              Buka linimasa
              ${icon("arrow-right", "h-4 w-4")}
            </a>
          </div>

          ${postsHtml}
        </section>
      </div>
    </div>`;

    refreshIcons();
  } catch (error) {
    showError(mainEl(), escapeHtml(error?.message ?? ""));
  }
}
