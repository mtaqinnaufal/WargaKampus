// Interactive forms. Ported from auth/*, places/*, profile/*.
// Mount functions build markup and wire events (no framework).
import { escapeHtml } from "../utils.js";
import { url } from "../config.js";
import { signIn, signUp } from "../actions/auth.js";
import { demoLogin } from "../actions/demo.js";
import { createPlace, report, review, savePlace } from "../actions/places.js";
import { updateProfile } from "../actions/profile.js";
import { uploadPlaceMedia, uploadReviewPhotos } from "../storage.js";
import { FACILITY_OPTIONS, PRICE_LEVELS } from "../config.js";
import { buttonClass, fieldHint, fieldLabel, formMessage, inputH, ratingInput, selectClass, textareaClass } from "./ui.js";
import { icon, refreshIcons } from "./icons.js";
import { mountLocationPicker } from "./location-picker.js";

function setMessage(el, message, ok) {
  if (!el) return;
  el.innerHTML = formMessage(message, { ok });
  refreshIcons();
}

/* ---------------------------------- Auth --------------------------------- */

export function mountSignInForm(container, { isDemo }) {
  container.innerHTML = `<form class="space-y-4" novalidate>
    ${
      isDemo
        ? `<div class="border border-signal bg-signal/20 px-3 py-2 text-sm leading-relaxed text-ink" role="status">Mode demo belum punya autentikasi. Kamu bisa langsung <a href="${url(
            "/jelajah",
          )}" class="font-semibold underline underline-offset-2">membuka peta</a>.</div>`
        : ""
    }
    <div>${fieldLabel({ htmlFor: "signin-email", text: "Email" })}<input id="signin-email" name="email" type="email" autocomplete="email" required placeholder="nama@kampus.ac.id" class="${inputH}"></div>
    <div>${fieldLabel({ htmlFor: "signin-password", text: "Password" })}<input id="signin-password" name="password" type="password" autocomplete="current-password" required minlength="6" placeholder="Password" class="${inputH}"></div>
    <div data-message></div>
    <button type="submit" class="${buttonClass({ className: "w-full" })}">Masuk</button>
    <p class="text-sm text-muted">Belum punya akun? <a href="${url("/daftar")}" class="font-semibold text-ink underline underline-offset-2">Daftar</a></p>
  </form>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    const result = await signIn({
      email: form.email.value,
      password: form.password.value,
    });
    if (!result.ok) {
      setMessage(message, result.message, false);
      submit.disabled = false;
    }
  });
}

export function mountSignUpForm(container, { campuses, isDemo }) {
  const options = campuses.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)} · ${escapeHtml(c.city)}</option>`).join("");
  container.innerHTML = `<form class="space-y-4" novalidate>
    ${
      isDemo
        ? `<div class="border border-signal bg-signal/20 px-3 py-2 text-sm leading-relaxed text-ink" role="status">Mode demo belum punya autentikasi. Kamu bisa langsung <a href="${url(
            "/jelajah",
          )}" class="font-semibold underline underline-offset-2">membuka peta</a>.</div>`
        : ""
    }
    <div>${fieldLabel({ htmlFor: "signup-name", text: "Nama" })}<input id="signup-name" name="name" autocomplete="name" required placeholder="Nama yang dipakai di komunitas" class="${inputH}"></div>
    <div>${fieldLabel({ htmlFor: "signup-email", text: "Email" })}<input id="signup-email" name="email" type="email" autocomplete="email" required placeholder="nama@kampus.ac.id" class="${inputH}"></div>
    <div>${fieldLabel({ htmlFor: "signup-password", text: "Password" })}<input id="signup-password" name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="Minimal 8 karakter" class="${inputH}">${fieldHint(
      "Gunakan password yang tidak dipakai di akun lain.",
    )}</div>
    <div>${fieldLabel({ htmlFor: "signup-campus", text: "Kampus" })}<select id="signup-campus" name="campus_id" class="${selectClass}">${options}</select></div>
    <div data-message></div>
    <button type="submit" class="${buttonClass({ className: "w-full" })}">Buat akun</button>
    <p class="text-sm text-muted">Sudah punya akun? <a href="${url("/masuk")}" class="font-semibold text-ink underline underline-offset-2">Masuk</a></p>
  </form>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    const result = await signUp({
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      campus_id: form.campus_id.value,
    });
    if (!result.ok) {
      setMessage(message, result.message, false);
      submit.disabled = false;
    } else if (result.message) {
      setMessage(message, result.message, true);
      submit.disabled = false;
    }
  });
}

const DEMO_ROLES = [
  { role: "mahasiswa", label: "Mahasiswa", name: "Rania Putri", icon: "graduation-cap" },
  { role: "pemilik", label: "Pemilik usaha", name: "Bu Tini", icon: "store" },
  { role: "admin", label: "Admin", name: "Admin WargaKampus", icon: "shield-check" },
];

export function mountDemoLogin(container) {
  container.innerHTML = `<button type="button" data-open-demo class="flex w-full items-center gap-3 rounded-sm border border-ink bg-surface px-4 py-3 text-left transition-colors hover:bg-paper-deep/40">
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-ink bg-signal">${icon("key-round", "h-4 w-4 text-ink")}</span>
      <span class="min-w-0 flex-1"><span class="block text-sm font-semibold text-ink">Login Cepat Akun Demo</span><span class="block text-xs text-muted">Mahasiswa, pemilik usaha, admin</span></span>
      ${icon("arrow-right", "h-4 w-4 shrink-0 text-ink")}
    </button>
    <p class="mt-2 text-[11px] leading-relaxed text-muted">Untuk presentasi. Set <span class="font-mono">DEMO_LOGIN_ENABLED=false</span> di production.</p>
    <dialog data-demo-dialog aria-labelledby="demo-dialog-title" class="demo-dialog m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-md border border-ink bg-surface p-0 text-ink shadow-lift">
      <div class="p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="font-mono text-[10px] text-muted">Akun demo</p>
            <h2 id="demo-dialog-title" class="mt-1 font-display text-2xl font-semibold leading-tight">Pilih role untuk masuk cepat.</h2>
            <p class="mt-1 text-sm leading-relaxed text-muted">Tiga akun ini hanya untuk presentasi.</p>
          </div>
          <button type="button" data-close-demo aria-label="Tutup dialog akun demo" class="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line text-muted transition-colors hover:bg-paper-deep hover:text-ink">${icon(
            "x",
            "h-4 w-4",
          )}</button>
        </div>
        <div class="mt-5 space-y-2" data-demo-list>
          ${DEMO_ROLES.map(
            (account) => `<button type="button" data-demo-role="${account.role}" class="flex w-full items-center gap-3 rounded-sm border border-line bg-paper/40 px-3 py-3 text-left transition-colors hover:border-ink hover:bg-paper-deep/50 disabled:cursor-not-allowed disabled:opacity-60">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-surface">${icon(
                account.icon,
                "h-4 w-4 text-ink",
              )}</span>
              <span class="min-w-0 flex-1"><span class="block text-sm font-semibold text-ink">${account.label}</span><span class="block text-xs text-muted">${account.name}</span></span>
              <span class="shrink-0 text-xs font-semibold text-ink">${icon("arrow-right", "h-4 w-4")}</span>
            </button>`,
          ).join("")}
        </div>
        <div data-demo-message class="mt-3"></div>
        <p class="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">Password demo: <span class="font-mono">WargaKampus123!</span>.</p>
      </div>
    </dialog>`;

  const dialog = container.querySelector("[data-demo-dialog]");
  const message = container.querySelector("[data-demo-message]");
  container.querySelector("[data-open-demo]").addEventListener("click", () => {
    setMessage(message, "", false);
    dialog.showModal();
  });
  container.querySelector("[data-close-demo]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  container.querySelectorAll("[data-demo-role]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const buttons = container.querySelectorAll("[data-demo-role]");
      buttons.forEach((b) => (b.disabled = true));
      const result = await demoLogin(btn.dataset.demoRole);
      if (!result.ok) {
        setMessage(message, result.message, false);
        buttons.forEach((b) => (b.disabled = false));
      }
    });
  });

  refreshIcons();
}

/* -------------------------------- Reviews -------------------------------- */

export function mountReviewForm(container, { placeId, slug, isDemo }) {
  container.innerHTML = `<form class="mt-6 border-t border-line pt-5" novalidate>
    <input type="hidden" name="place_id" value="${escapeHtml(placeId)}">
    <h3 class="font-display text-xl font-semibold">Tulis ulasan</h3>
    <p class="mt-1 text-sm text-muted">Ceritakan pengalaman nyata. Sebutkan hal yang berguna: harga, porsi, WiFi, atau jam ramai.</p>
    <div class="mt-4">${ratingInput({ name: "rating", defaultValue: 5 })}</div>
    <div class="mt-4">${fieldLabel({ htmlFor: "review-body", text: "Catatan", hint: "opsional" })}<textarea id="review-body" name="body" rows="4" class="${textareaClass}" placeholder="Contoh: ayam bakarnya besar, sambalnya pedas."></textarea></div>
    <div class="mt-4">${fieldLabel({ htmlFor: "review-photos", text: "Foto", hint: "opsional" })}<input id="review-photos" type="file" accept="image/*" multiple class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink">${fieldHint(
      "JPG, PNG, WebP, atau GIF. Maksimal 5 MB per gambar.",
    )}</div>
    ${isDemo ? `<p class="mt-3 text-xs leading-relaxed text-muted">Mode demo belum menyimpan ulasan.</p>` : ""}
    <div data-message class="mt-4"></div>
    <div class="mt-4"><button type="submit" class="${buttonClass()}">Simpan ulasan</button></div>
  </form>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  const files = [];
  container.querySelector("#review-photos").addEventListener("change", (event) => {
    files.length = 0;
    Array.from(event.target.files ?? []).forEach((file) => file.size > 0 && files.push(file));
  });
  wireRatingInput(container);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    const result = await review({
      place_id: placeId,
      rating: Number(form.querySelector("input[name=rating]").value),
      body: form.querySelector("textarea[name=body]").value,
    });
    if (!result.ok) {
      setMessage(message, result.message, false);
      submit.disabled = false;
      return;
    }
    if (files.length && result.reviewId) {
      try {
        await uploadReviewPhotos(result.reviewId, files);
      } catch {
        /* keep the review even if photos fail */
      }
    }
    window.location.reload();
  });
}

function wireRatingInput(container) {
  const root = container.querySelector("[data-rating-input]");
  if (!root) return;
  const hidden = root.querySelector("input[type=hidden]");
  const valueEl = root.querySelector("[data-rating-value]");
  root.querySelectorAll("[data-rating]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = Number(btn.dataset.rating);
      hidden.value = value;
      valueEl.textContent = `${value}/5`;
      root.querySelectorAll("[data-rating]").forEach((b) => {
        const on = Number(b.dataset.rating) <= value;
        b.setAttribute("aria-checked", String(Number(b.dataset.rating) === value));
        b.querySelector("svg")?.classList.toggle("fill-signal", on);
        b.querySelector("svg")?.classList.toggle("text-ink", on);
        b.querySelector("svg")?.classList.toggle("fill-transparent", !on);
        b.querySelector("svg")?.classList.toggle("text-line-strong", !on);
      });
    });
  });
}

/* ----------------------------- Place actions ----------------------------- */

export function mountSavePlaceButton(container, { placeId, initialSaved }) {
  let saved = initialSaved;
  const render = (message) => {
    container.innerHTML = `<div>
      <button type="button" class="${buttonClass({ variant: saved ? "secondary" : "outline" })}" data-save>${icon(
        "bookmark",
        saved ? "h-4 w-4 fill-current" : "h-4 w-4",
      )} ${saved ? "Tersimpan" : "Simpan"}</button>
      ${message ? `<div class="mt-2 max-w-xs">${formMessage(message)}</div>` : ""}
    </div>`;
    refreshIcons();
    container.querySelector("[data-save]").addEventListener("click", toggle);
  };
  const toggle = async () => {
    const next = !saved;
    const result = await savePlace(placeId, next);
    if (result.ok) saved = next;
    render(result.ok ? null : result.message);
  };
  render(null);
}

export function mountReportForm(container, { placeId, isDemo }) {
  container.innerHTML = `<details class="border-t border-line pt-4">
    <summary class="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink">${icon(
      "flag",
      "h-4 w-4",
    )} Laporkan info yang salah</summary>
    <form class="mt-3" novalidate>
      <input type="hidden" name="target_type" value="place">
      <input type="hidden" name="target_id" value="${escapeHtml(placeId)}">
      ${fieldLabel({ htmlFor: "report-reason", text: "Apa yang perlu dicek?" })}
      <textarea id="report-reason" name="reason" rows="3" required class="${textareaClass}" placeholder="Contoh: harga sudah naik, tempat sudah tutup, atau alamatnya bergeser."></textarea>
      ${isDemo ? `<p class="mt-2 text-xs leading-relaxed text-muted">Mode demo belum mengirim laporan.</p>` : ""}
      <div data-message class="mt-3"></div>
      <div class="mt-3"><button type="submit" class="${buttonClass()}">Kirim laporan</button></div>
    </form>
  </details>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    const result = await report({ target_type: "place", target_id: placeId, reason: form.reason.value });
    setMessage(message, result.message, result.ok);
    if (result.ok) form.reset();
    submit.disabled = false;
  });
}

/* --------------------------- Place media form ---------------------------- */

export function mountPlaceMediaForm(container, { placeId, isDemo }) {
  container.innerHTML = `<section class="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
    <div class="flex items-start gap-3">
      <span class="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-paper-deep">${icon("image-plus", "h-4 w-4")}</span>
      <div><h2 class="font-display text-xl font-semibold">Kelola media usaha</h2><p class="mt-1 text-xs leading-relaxed text-muted">Unggah banner, pricelist, atau foto baru.</p></div>
    </div>
    <form class="mt-4 space-y-4" novalidate>
      <div class="space-y-3">
        <label class="block text-xs font-medium text-ink">Banner usaha<input type="file" accept="image/*" data-banner class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"></label>
        <label class="block text-xs font-medium text-ink">Gambar pricelist<input type="file" accept="image/*" data-pricelist class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"></label>
        <label class="block text-xs font-medium text-ink">Foto usaha<input type="file" accept="image/*" multiple data-photos class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"><span class="mt-1 block text-[10px] text-muted">Bisa pilih beberapa foto. Maksimal 5 MB per gambar.</span></label>
      </div>
      <div data-message></div>
      <button type="submit" class="${buttonClass({ className: "w-full" })}">Unggah media</button>
    </form>
  </section>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  const pick = (selector) => form.querySelector(selector).files?.[0] ?? null;
  const photos = [];
  form.querySelector("[data-photos]").addEventListener("change", (event) => {
    photos.length = 0;
    Array.from(event.target.files ?? []).forEach((file) => file.size > 0 && photos.push(file));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const banner = pick("[data-banner]");
    const pricelist = pick("[data-pricelist]");
    if (!banner && !pricelist && photos.length === 0) {
      setMessage(message, "Pilih minimal satu gambar untuk diunggah.", false);
      return;
    }
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    try {
      await uploadPlaceMedia(placeId, { banner, pricelist, photos });
      window.location.assign(`${url(`/tempat/${window.__placeSlug ?? ""}`)}?media=ok`);
    } catch (error) {
      setMessage(message, error instanceof Error ? error.message : "Media gagal diunggah.", false);
      submit.disabled = false;
    }
  });
}

/* ---------------------------- Profile form ------------------------------- */

export function mountProfileForm(container, { profile, campuses, email, isDemo }) {
  const options = campuses
    .map(
      (campus) =>
        `<option value="${escapeHtml(campus.id)}" ${
          profile.campus_id === campus.id ? "selected" : ""
        }>${escapeHtml(campus.name)} · ${escapeHtml(campus.city)}</option>`,
    )
    .join("");

  container.innerHTML = `<form class="space-y-4" novalidate>
    <div>${fieldLabel({ htmlFor: "profile-name", text: "Nama" })}<input id="profile-name" name="name" required value="${escapeHtml(
      profile.name,
    )}" class="${inputH}"></div>
    <div>${fieldLabel({ htmlFor: "profile-email", text: "Email" })}<input id="profile-email" value="${escapeHtml(
      email ?? "",
    )}" readonly class="${inputH} bg-paper-deep text-muted">${fieldHint("Email tidak bisa diubah dari halaman ini.", "profile-email-hint")}</div>
    <div>${fieldLabel({ htmlFor: "profile-bio", text: "Bio", hint: "opsional" })}<textarea id="profile-bio" name="bio" rows="3" class="${textareaClass}" placeholder="Contoh: Mahasiswa Ilkom. Suka tempat nugas yang tenang.">${escapeHtml(
      profile.bio ?? "",
    )}</textarea></div>
    <div>${fieldLabel({ htmlFor: "profile-campus", text: "Kampus" })}<select id="profile-campus" name="campus_id" class="${selectClass}">${options}</select></div>
    <div>${fieldLabel({ htmlFor: "profile-avatar", text: "Foto profil", hint: "opsional" })}
      <div class="mt-2 flex items-center gap-3">
        <span data-avatar-preview>${require_avatar(profile)}</span>
        <input id="profile-avatar" type="file" accept="image/*" data-avatar class="block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink">
      </div>
      ${fieldHint("JPG, PNG, WebP, atau GIF. Maksimal 5 MB.")}
    </div>
    ${isDemo ? `<p class="text-xs leading-relaxed text-muted">Mode demo belum menyimpan perubahan.</p>` : ""}
    <div data-message></div>
    <button type="submit" class="${buttonClass({ className: "w-full" })}">Simpan profil</button>
  </form>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    const result = await updateProfile({
      name: form.name.value,
      bio: form.bio.value,
      campus_id: form.campus_id.value,
    });
    if (!result.ok) {
      setMessage(message, result.message, false);
      submit.disabled = false;
      return;
    }
    const avatarFile = form.querySelector("[data-avatar]").files?.[0];
    if (avatarFile && avatarFile.size > 0) {
      try {
        const { uploadAvatar } = await import("../storage.js");
        await uploadAvatar(avatarFile);
      } catch {
        /* profile saved; avatar failed silently */
      }
    }
    window.location.reload();
  });
}

function require_avatar(profile) {
  // Local avatar html (avoid importing ui avatar to keep imports tidy).
  const src = profile.avatar_url;
  if (src) return `<img src="${escapeHtml(src)}" alt="" width="48" height="48" class="h-12 w-12 rounded-full border border-line object-cover">`;
  const name = escapeHtml(profile.name);
  return `<span class="grid h-12 w-12 place-items-center rounded-full border border-line bg-paper-deep font-mono font-semibold text-ink">${escapeHtml(
    profile.name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join(""),
  )}</span>`;
}

/* --------------------------- Add place form ------------------------------ */

export function mountAddPlaceForm(container, { categories, campus, isDemo }) {
  const categoryOptions = categories
    .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
    .join("");
  const priceOptions = PRICE_LEVELS.map(
    (level) => `<option value="${level.value}" ${level.value === 2 ? "selected" : ""}>${level.label} · ${level.hint}</option>`,
  ).join("");
  const facilities = FACILITY_OPTIONS.map(
    (facility) =>
      `<label class="flex min-h-9 items-center gap-2 rounded-sm px-1 text-sm text-ink-soft hover:bg-paper-deep"><input type="checkbox" name="facilities" value="${escapeHtml(
        facility,
      )}" class="h-4 w-4 accent-signal"> ${escapeHtml(facility)}</label>`,
  ).join("");

  container.innerHTML = `<form class="grid gap-8 lg:grid-cols-[1fr_0.9fr]" novalidate>
    <div class="space-y-6">
      <section class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">${fieldLabel({ htmlFor: "place-name", text: "Nama tempat" })}<input id="place-name" name="name" required placeholder="Contoh: Warung Nasi Bu Tini" class="${inputH}"></div>
        <div>${fieldLabel({ htmlFor: "place-category", text: "Kategori" })}<select id="place-category" name="category_id" required class="${selectClass}"><option value="" disabled selected>Pilih kategori</option>${categoryOptions}</select></div>
        <div>${fieldLabel({ htmlFor: "place-price-level", text: "Kisaran harga" })}<select id="place-price-level" name="price_level" class="${selectClass}">${priceOptions}</select></div>
        <div class="sm:col-span-2">${fieldLabel({ htmlFor: "place-address", text: "Alamat atau patokan" })}<input id="place-address" name="address" placeholder="Contoh: Jl. Lingkar Luar Barat" class="${inputH}">${fieldHint(
          "Patokan lebih berguna daripada alamat lengkap yang panjang.",
        )}</div>
        <div>${fieldLabel({ htmlFor: "place-price-min", text: "Harga minimum", hint: "opsional" })}<input id="place-price-min" name="price_min" type="number" min="0" step="1000" placeholder="10000" class="${inputH}"></div>
        <div>${fieldLabel({ htmlFor: "place-price-max", text: "Harga maksimum", hint: "opsional" })}<input id="place-price-max" name="price_max" type="number" min="0" step="1000" placeholder="30000" class="${inputH}"></div>
        <div class="sm:col-span-2">${fieldLabel({ htmlFor: "place-description", text: "Deskripsi singkat", hint: "opsional" })}<textarea id="place-description" name="description" rows="4" class="${textareaClass}" placeholder="Apa yang membuat tempat ini berguna untuk mahasiswa?"></textarea></div>
        <div class="sm:col-span-2">${fieldLabel({ htmlFor: "place-hours", text: "Jam buka", hint: "opsional" })}<input id="place-hours" name="open_hours_note" placeholder="Contoh: Setiap hari 08.00 sampai 22.00" class="${inputH}"></div>
        <div class="sm:col-span-2 rounded-md border border-line bg-surface/60 p-4">
          <div class="flex items-start gap-3"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-paper-deep">${icon(
            "image-plus",
            "h-4 w-4",
          )}</span><div><h3 class="text-sm font-medium text-ink">Media usaha</h3><p class="mt-1 text-xs leading-relaxed text-muted">Banner tampil paling atas, pricelist di panel kanan, dan foto masuk galeri.</p></div></div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <label class="block text-xs font-medium text-ink">Banner usaha<input type="file" accept="image/*" data-banner class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"></label>
            <label class="block text-xs font-medium text-ink">Gambar pricelist<input type="file" accept="image/*" data-pricelist class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"></label>
            <label class="block text-xs font-medium text-ink">Foto usaha<input type="file" accept="image/*" multiple data-photos class="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"></label>
          </div>
        </div>
      </section>
      <fieldset class="border-t border-line pt-5"><legend class="text-sm font-medium text-ink">Fasilitas yang terlihat</legend><p class="mt-1 text-xs text-muted">Centang yang kamu yakin.</p><div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">${facilities}</div></fieldset>
      <div class="border-t border-line pt-5">
        <div class="flex items-start gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs leading-relaxed text-muted">${icon(
          "info",
          "mt-0.5 h-4 w-4 shrink-0",
        )} Tempat baru akan berstatus menunggu verifikasi.</div>
        <div data-message class="mt-3"></div>
        <div class="mt-4 flex flex-wrap items-center gap-3"><button type="submit" class="${buttonClass()}">Kirim untuk verifikasi</button><span class="flex items-center gap-1.5 text-xs text-muted">${icon(
          "circle-check",
          "h-3.5 w-3.5",
        )} Bisa disunting setelah dikirim</span></div>
      </div>
    </div>
    <aside class="space-y-4"><div class="lg:sticky lg:top-6">
      <div class="mb-3"><h2 class="font-display text-xl font-semibold">Tentukan pin lokasi</h2><p class="mt-1 text-sm leading-relaxed text-muted">Klik peta atau geser pin.</p></div>
      <div data-location-picker></div>
      <p class="mt-3 font-mono text-[10px] leading-relaxed text-muted">Pusat awal: ${escapeHtml(campus.name)}, ${escapeHtml(
        campus.city,
      )}.</p>
    </div></aside>
  </form>`;

  const form = container.querySelector("form");
  const message = container.querySelector("[data-message]");
  const coordinates = { latitude: campus.latitude, longitude: campus.longitude };
  const files = { banner: null, pricelist: null, photos: [] };

  mountLocationPicker(form.querySelector("[data-location-picker]"), {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    onChange: (latitude, longitude) => {
      coordinates.latitude = latitude;
      coordinates.longitude = longitude;
    },
  });

  form.querySelector("[data-banner]").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    files.banner = file && file.size > 0 ? file : null;
  });
  form.querySelector("[data-pricelist]").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    files.pricelist = file && file.size > 0 ? file : null;
  });
  form.querySelector("[data-photos]").addEventListener("change", (event) => {
    files.photos = Array.from(event.target.files ?? []).filter((file) => file.size > 0);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type=submit]");
    submit.disabled = true;
    setMessage(message, "", false);
    const result = await createPlace({
      name: form.name.value,
      category_id: form.category_id.value,
      description: form.description.value,
      address: form.address.value,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      price_min: form.price_min.value ? Number(form.price_min.value) : null,
      price_max: form.price_max.value ? Number(form.price_max.value) : null,
      price_level: Number(form.price_level.value),
      facilities: Array.from(form.querySelectorAll("input[name=facilities]:checked")).map((c) => c.value),
      open_hours_note: form.open_hours_note.value,
    });
    if (!result.ok) {
      setMessage(message, result.message, false);
      submit.disabled = false;
      return;
    }
    const hasFiles = files.banner || files.pricelist || files.photos.length > 0;
    if (hasFiles) {
      try {
        await uploadPlaceMedia(result.placeId, files);
        window.location.assign(`${url(`/tempat/${result.slug}`)}?media=ok`);
        return;
      } catch {
        window.location.assign(`${url(`/tempat/${result.slug}`)}?media=error`);
        return;
      }
    }
    window.location.assign(`${url(`/tempat/${result.slug}`)}?status=pending`);
  });

  refreshIcons();
}
