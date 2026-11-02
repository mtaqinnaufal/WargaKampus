// Linimasa page — ported from src/app/(app)/linimasa/page.tsx.
import { initPage, mainEl, showError } from "../page-common.js";
import { getPlaces } from "../api/places.js";
import { getPosts } from "../api/posts.js";
import { mountFeed } from "../components/feed.js";
import { avatar, badge, buttonClass } from "../components/ui.js";
import { refreshIcons } from "../components/icons.js";
import { ROLE_LABELS, url } from "../config.js";
import { escapeHtml } from "../utils.js";

const { current, campus } = await initPage();

if (!campus) {
  showError(mainEl(), "Data kampus belum tersedia.");
} else {
  try {
    const [posts, places] = await Promise.all([
      getPosts({ campusId: campus.id, userId: current.user?.id ?? null, limit: 40 }),
      getPlaces(),
    ]);

    const contributors = Array.from(
      posts.reduce((map, post) => {
        if (!post.author) return map;
        const existing = map.get(post.author.id);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(post.author.id, { ...post.author, count: 1 });
        }
        return map;
      }, new Map()),
    )
      .map(([, value]) => value)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const roleLabel = (role) =>
      role === "admin" ? ROLE_LABELS.admin : role === "pemilik" ? ROLE_LABELS.pemilik : ROLE_LABELS.mahasiswa;

    const contributorItems = contributors
      .map(
        (person) => `<li class="flex items-center gap-3">
                  ${avatar({ name: person.name, src: person.avatar_url, size: "sm", decorative: true })}
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-ink">${escapeHtml(person.name)}</p>
                    <p class="text-xs text-muted">
                      ${escapeHtml(roleLabel(person.role))}
                    </p>
                  </div>
                  <span class="font-mono text-[10px] text-muted">${escapeHtml(person.count)}</span>
                </li>`,
      )
      .join("");

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
        <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-signal" aria-hidden="true"></span>
              <span class="font-mono text-[11px] text-muted">${escapeHtml(campus.name)}</span>
              ${current.isDemo ? badge("Data demo", { variant: "signal" }) : ""}
            </div>
            <h1 class="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Linimasa kampus.
            </h1>
            <p class="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">
              Info dari mahasiswa, untuk mahasiswa. Sebut tempatnya, jelaskan yang berguna, dan
              jangan bagikan data pribadi orang lain.
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
              <span>
                <strong class="font-mono text-sm text-ink">${escapeHtml(posts.length)}</strong> cerita
              </span>
              <span class="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true"></span>
              <span>
                <strong class="font-mono text-sm text-ink">${escapeHtml(contributors.length)}</strong>
                kontributor
              </span>
              <span class="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true"></span>
              <span>Diperbarui dari komunitas</span>
            </div>
          </div>

          <a
            href="${url("/jelajah")}"
            class="${buttonClass({ variant: "outline", size: "md" })}"
          >
            Cari tempat di peta
          </a>
        </div>
      </header>

      <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="min-w-0" data-feed></div>

        <aside
          aria-label="Panduan dan kontributor"
          class="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1 lg:overscroll-contain"
        >
          <section class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <h2 class="font-display text-xl font-semibold">Aturan singkat</h2>
            <ul class="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <li>
                <span class="font-medium text-ink">Sebut tempatnya.</span> Nama, patokan, dan
                kisaran harga lebih berguna daripada &ldquo;dekat kampus&rdquo;.
              </li>
              <li>
                <span class="font-medium text-ink">Jangan doxing.</span> Jangan bagikan nomor
                pribadi, alamat kos, atau foto orang tanpa izin.
              </li>
              <li>
                <span class="font-medium text-ink">Beri tahu kalau berubah.</span> Harga naik
                atau tempat tutup? Laporkan lewat halaman tempat.
              </li>
            </ul>
          </section>

          <section class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <div class="flex items-end justify-between gap-3">
              <h2 class="font-display text-xl font-semibold">Kontributor</h2>
              <span class="font-mono text-[10px] text-muted">Minggu ini</span>
            </div>
            <ul class="mt-3 space-y-3">
              ${contributorItems}
            </ul>
            ${contributors.length === 0 ? `<p class="mt-3 text-sm text-muted">Belum ada kontributor.</p>` : ""}
          </section>

          <section class="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <h2 class="font-display text-xl font-semibold">Cari yang belum ada?</h2>
            <p class="mt-2 text-sm leading-relaxed text-muted">
              Tambahkan tempat baru. Setelah diverifikasi admin, tempat itu bisa dibahas di
              linimasa.
            </p>
            <a
              href="${url("/tempat/baru")}"
              class="mt-3 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
            >
              Tambah tempat
            </a>
          </section>
        </aside>
      </div>
    </div>`;

    mountFeed(mainEl().querySelector("[data-feed]"), {
      posts,
      places,
      currentUserId: current.user?.id ?? null,
      isDemo: current.isDemo,
      campusName: campus.name,
    });

    refreshIcons();
  } catch (error) {
    showError(mainEl(), escapeHtml(error?.message ?? ""));
  }
}
