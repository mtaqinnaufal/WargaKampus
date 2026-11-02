// Profil page. Ported from src/app/(app)/profil/page.tsx.
import { initPage, mainEl, showError } from "../page-common.js";
import { getCampuses } from "../api/campuses.js";
import { getContributions } from "../api/profile.js";
import { ROLE_LABELS, url } from "../config.js";
import { escapeHtml, relativeTime } from "../utils.js";
import { avatar, badge, starRating } from "../components/ui.js";
import { icon, refreshIcons } from "../components/icons.js";
import { placeGridCard, postPreview } from "../components/cards.js";
import { mountProfileForm } from "../components/forms.js";

const { current, campus: defaultCampus } = await initPage();

if (!current.profile) {
  window.location.assign(url("/masuk?next=/profil"));
} else {
  const profile = current.profile;
  const isDemo = Boolean(current.isDemo);

  try {
    const [campuses, contributions] = await Promise.all([
      getCampuses(),
      getContributions(profile.id),
    ]);
    render({ current, profile, isDemo, campuses, contributions, defaultCampus });
  } catch (error) {
    showError(mainEl(), error instanceof Error ? error.message : "");
  }
}

function render({ current, profile, isDemo, campuses, contributions, defaultCampus }) {
  const campus =
    campuses.find((item) => item.id === profile.campus_id) ?? campuses[0] ?? defaultCampus ?? null;
  const joined = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
    new Date(profile.created_at),
  );
  const roleLabel = escapeHtml(ROLE_LABELS[profile.role] ?? profile.role ?? "");
  const campusLine = campus
    ? `${escapeHtml(campus.name)} · ${escapeHtml(campus.city)}`
    : "Kampus belum dipilih";

  const placesHtml = contributions.places.length
    ? `<div class="mt-4 grid gap-4 sm:grid-cols-2">${contributions.places
        .map((place) => placeGridCard(place))
        .join("")}</div>`
    : `<div class="mt-4 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5">
        <p class="text-sm text-muted">Belum ada tempat. Tambahkan tempat yang belum ada di peta.</p>
        <a href="${url("/tempat/baru")}" class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink">Tambah tempat ${icon(
          "arrow-right",
          "h-4 w-4",
        )}</a>
      </div>`;

  const postsHtml = contributions.posts.length
    ? `<div class="mt-2">${contributions.posts.map((post) => postPreview(post)).join("")}</div>`
    : `<div class="mt-4 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5">
        <p class="text-sm text-muted">Belum ada postingan. Bagikan satu info yang kamu ingin temukan sendiri waktu pertama kali sampai di Jakarta.</p>
        <a href="${url("/linimasa")}" class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink">Buka linimasa ${icon(
          "arrow-right",
          "h-4 w-4",
        )}</a>
      </div>`;

  const reviewsHtml = contributions.reviews.length
    ? `<div class="mt-2">${contributions.reviews
        .map(
          (review) => `<article class="border-b border-line py-4 last:border-b-0 last:pb-0">
            <div class="flex flex-wrap items-center gap-2">
              ${starRating(review.rating, { showCount: false })}
              ${
                review.place
                  ? `<a href="${url(`/tempat/${review.place.slug}`)}" class="text-sm font-medium text-ink hover:underline">${escapeHtml(
                      review.place.name,
                    )}</a>`
                  : ""
              }
              <time datetime="${escapeHtml(review.created_at)}" class="text-xs text-muted">${escapeHtml(
                relativeTime(review.created_at),
              )}</time>
            </div>
            ${
              review.body
                ? `<p class="prose-kp mt-2 text-sm text-ink-soft">${escapeHtml(review.body)}</p>`
                : ""
            }
          </article>`,
        )
        .join("")}</div>`
    : `<div class="mt-4 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5">
        <p class="text-sm text-muted">Belum ada ulasan. Ulasan pertama bisa dimulai dari tempat yang paling sering kamu datangi.</p>
        <a href="${url("/jelajah")}" class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink">Cari tempat ${icon(
          "arrow-right",
          "h-4 w-4",
        )}</a>
      </div>`;

  mainEl().innerHTML = `<div class="container-page py-6 lg:py-8">
    <header class="relative overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:p-6 lg:p-8">
      <div class="grid-paper pointer-events-none absolute inset-0 opacity-20" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal/10 blur-3xl" aria-hidden="true"></div>

      <div class="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        ${avatar({
          name: profile.name,
          src: profile.avatar_url,
          size: "xl",
          decorative: true,
          className: "ring-4 ring-signal/25 ring-offset-2 ring-offset-surface",
        })}
        <div class="min-w-0 flex-1">
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Profil komunitas</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            ${badge(roleLabel, { variant: "outline" })}
            ${isDemo ? badge("Mode demo", { variant: "signal" }) : ""}
            ${
              profile.role === "admin"
                ? `<a href="${url("/admin")}" class="inline-flex items-center gap-1 text-xs font-semibold text-ink underline underline-offset-2">${icon(
                    "shield-check",
                    "h-3.5 w-3.5",
                  )} Buka admin</a>`
                : ""
            }
          </div>
          <h1 class="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">${escapeHtml(
            profile.name,
          )}</h1>
          <p class="mt-1 text-sm text-muted">${campusLine} · Bergabung ${escapeHtml(joined)}</p>
          ${
            profile.bio
              ? `<p class="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft">${escapeHtml(
                  profile.bio,
                )}</p>`
              : ""
          }
        </div>
      </div>

      <dl class="relative mt-6 grid max-w-xl grid-cols-3 gap-3">
        <div class="rounded-lg border border-line bg-paper/70 px-4 py-3">
          <dt class="text-[10px] text-muted">Tempat</dt>
          <dd class="mt-1 font-mono text-2xl font-semibold text-ink">${contributions.places.length}</dd>
        </div>
        <div class="rounded-lg border border-line bg-paper/70 px-4 py-3">
          <dt class="text-[10px] text-muted">Postingan</dt>
          <dd class="mt-1 font-mono text-2xl font-semibold text-ink">${contributions.posts.length}</dd>
        </div>
        <div class="rounded-lg border border-line bg-paper/70 px-4 py-3">
          <dt class="text-[10px] text-muted">Ulasan</dt>
          <dd class="mt-1 font-mono text-2xl font-semibold text-ink">${contributions.reviews.length}</dd>
        </div>
      </dl>
    </header>

    <div class="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div class="space-y-6">
        <div class="reveal">
          <section aria-labelledby="my-places-title" class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="my-places-title" class="font-display text-2xl font-semibold">Tempat yang saya tambahkan</h2>
                ${
                  profile.role === "pemilik"
                    ? `<p class="mt-1 text-xs leading-relaxed text-muted">Kelola banner, pricelist, dan foto dari halaman detail tempat.</p>`
                    : ""
                }
              </div>
              <span class="font-mono text-[10px] text-muted">${contributions.places.length} tempat</span>
            </div>
            ${placesHtml}
          </section>
        </div>

        <div class="reveal reveal-delay-1">
          <section aria-labelledby="my-posts-title" class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <h2 id="my-posts-title" class="font-display text-2xl font-semibold">Postingan saya</h2>
              <span class="font-mono text-[10px] text-muted">${contributions.posts.length} cerita</span>
            </div>
            ${postsHtml}
          </section>
        </div>

        <div class="reveal reveal-delay-2">
          <section aria-labelledby="my-reviews-title" class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <h2 id="my-reviews-title" class="font-display text-2xl font-semibold">Ulasan saya</h2>
              <span class="font-mono text-[10px] text-muted">${contributions.reviews.length} ulasan</span>
            </div>
            ${reviewsHtml}
          </section>
        </div>
      </div>

      <aside aria-label="Pengaturan profil" class="space-y-4 lg:sticky lg:top-24">
        <section class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
          <h2 class="font-display text-xl font-semibold">Edit profil</h2>
          <p class="mt-1 text-sm leading-relaxed text-muted">Nama dan bio terlihat oleh pengguna lain. Email hanya untuk akun.</p>
          <div class="mt-4" id="profile-form"></div>
        </section>

        <section class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
          <h2 class="font-display text-xl font-semibold">Akun</h2>
          <dl class="mt-3 space-y-3 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Peran</dt>
              <dd>${roleLabel}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Kampus</dt>
              <dd class="text-right">${campus ? escapeHtml(campus.name) : "Belum dipilih"}</dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt class="text-muted">Reputasi</dt>
              <dd class="font-mono">${escapeHtml(profile.reputation_points ?? 0)}</dd>
            </div>
          </dl>
        </section>
      </aside>
    </div>
  </div>`;

  mountProfileForm(document.getElementById("profile-form"), {
    profile,
    campuses,
    email: current.user?.email,
    isDemo,
  });

  refreshIcons();
}
