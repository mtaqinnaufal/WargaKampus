// Add-place page. Ported from src/app/(app)/tempat/baru/page.tsx (+ places/add-place-form.tsx).
import { initPage, mainEl } from "../page-common.js";
import { url } from "../config.js";
import { getCategories } from "../api/places.js";
import { getDefaultCampus } from "../api/campuses.js";
import { mountAddPlaceForm } from "../components/forms.js";
import { refreshIcons } from "../components/icons.js";

async function init() {
  const { current } = await initPage();
  const [categories, campus] = await Promise.all([getCategories(), getDefaultCampus()]);

  // requireUser semantics: send anonymous visitors to sign in first.
  if (!current.profile) {
    window.location.assign(url("/masuk?next=/tempat/baru"));
    return;
  }

  mainEl().innerHTML = `<div class="container-page py-6 lg:py-8">
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-xs text-muted">
      <a href="${url("/jelajah")}" class="hover:text-ink">Jelajah</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink">Tambah tempat</span>
    </nav>

    <header class="mt-4 border-b border-line pb-6">
      <h1 class="max-w-[20ch] font-display text-3xl font-bold leading-tight sm:text-4xl">Tambah tempat yang belum ada di peta.</h1>
      <p class="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">Isi informasi yang kamu tahu. Setelah dikirim, admin akan mengecek sebelum tempat tampil untuk semua mahasiswa.</p>
    </header>

    <div class="mt-8" data-add-place></div>
  </div>`;

  refreshIcons();

  mountAddPlaceForm(mainEl().querySelector("[data-add-place]"), {
    categories,
    campus,
    isDemo: current.isDemo,
  });
}

init();
