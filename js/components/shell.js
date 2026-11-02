// App shell: top bar, navigation, demo banner, footer. Ported from app-shell/*.
import { escapeHtml } from "../utils.js";
import { url } from "../config.js";
import { avatar, badge, buttonClass } from "./ui.js";
import { icon, refreshIcons } from "./icons.js";

const BASE_ITEMS = [
  { href: "/", label: "Home", icon: "house" },
  { href: "/jelajah", label: "Jelajah", icon: "map" },
  { href: "/linimasa", label: "Linimasa", icon: "newspaper" },
  { href: "/simpan", label: "Simpan", icon: "bookmark" },
  { href: "/profil", label: "Profil", icon: "user" },
];

function currentPath() {
  return window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
}

export function navLinksHtml({ variant = "top", isAdmin = false, activePath = currentPath() } = {}) {
  const items = isAdmin
    ? [...BASE_ITEMS, { href: "/admin", label: "Admin", icon: "shield-check" }]
    : BASE_ITEMS;

  const listClass =
    variant === "sidebar"
      ? "space-y-1"
      : variant === "mobile"
        ? "flex items-stretch gap-1"
        : "flex items-center gap-1";

  const lis = items
    .map((item) => {
      const active = activePath === item.href || activePath.startsWith(`${item.href}/`);
      const cls =
        variant === "sidebar"
          ? `px-3 py-2.5 ${active ? "bg-ink text-surface" : "text-muted hover:bg-paper-deep hover:text-ink"}`
          : variant === "mobile"
            ? `w-full flex-col justify-center gap-1 px-1 py-2 text-[11px] ${active ? "bg-signal text-ink" : "text-muted hover:bg-paper-deep hover:text-ink"}`
            : `px-3 py-2 ${active ? "bg-signal text-ink" : "text-muted hover:bg-paper-deep hover:text-ink"}`;
      const liClass = variant === "mobile" ? "min-w-0 flex-1" : "";
      return `<li class="${liClass}"><a href="${url(item.href)}" ${active ? 'aria-current="page"' : ""} class="flex items-center gap-2.5 rounded-sm text-sm transition-colors ${cls}">${icon(
        item.icon,
        "h-4 w-4",
      )}<span>${item.label}</span></a></li>`;
    })
    .join("");

  return `<ul class="${listClass}">${lis}</ul>`;
}

export function brandMarkHtml({ tone = "dark" } = {}) {
  const textColor = tone === "light" ? "text-surface" : "text-ink";
  return `<a href="${url("/")}" aria-label="WargaKampus, kembali ke beranda" class="inline-flex items-center gap-2.5 ${textColor}">
    <svg viewBox="0 0 64 64" class="h-9 w-9 shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="60" height="60" rx="10" fill="#F2C200" stroke="#0B1A28" stroke-width="4"></rect>
      <path d="M32 12c-8.8 0-16 6.7-16 15 0 11.3 16 26 16 26s16-14.7 16-26c0-8.3-7.2-15-16-15Z" fill="none" stroke="#0B1A28" stroke-width="3.6" stroke-linejoin="round"></path>
      <path d="M23 24.5l4 11 5-8 5 8 4-11" fill="none" stroke="#0B1A28" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
    <span class="font-display text-[20px] font-bold leading-none tracking-[-0.045em] ${textColor}">WargaKampus</span>
  </a>`;
}

export function demoBannerHtml(isDemo) {
  if (!isDemo) return "";
  return `<div role="status" class="border-b border-ink/20 bg-signal text-ink">
    <div class="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
      <p class="flex items-center gap-2">${icon("info", "h-3.5 w-3.5 shrink-0")} Mode demo: data contoh dari OpenStreetMap. Perubahan belum disimpan.</p>
      <a href="${url("/setup")}" class="font-semibold underline underline-offset-2">Panduan Supabase</a>
    </div>
  </div>`;
}

export function topBarHtml({ profile, campus, isDemo = false, activePath = currentPath() } = {}) {
  const account = profile
    ? `<details class="relative">
        <summary aria-label="Menu akun ${escapeHtml(profile.name)}" class="flex cursor-pointer list-none items-center gap-2 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-paper-deep [&::-webkit-details-marker]:hidden">
          ${avatar({ name: profile.name, src: profile.avatar_url, size: "sm", decorative: true })}
          <span class="hidden max-w-28 truncate text-sm font-medium sm:block">${escapeHtml(profile.name)}</span>
          ${icon("chevron-down", "hidden h-3.5 w-3.5 text-muted sm:block")}
        </summary>
        <div class="absolute right-0 z-50 mt-2 w-48 rounded-sm border border-line bg-surface p-1 shadow-lift">
          <a href="${url("/profil")}" class="block rounded-sm px-3 py-2 text-sm text-ink hover:bg-paper-deep">Profil</a>
          ${
            profile.role === "admin"
              ? `<a href="${url("/admin")}" class="block rounded-sm px-3 py-2 text-sm text-ink hover:bg-paper-deep">Admin</a>`
              : ""
          }
          <a href="${url("/auth/signout")}" class="block w-full rounded-sm px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-paper-deep hover:text-ink">Keluar</a>
        </div>
      </details>`
    : `<a href="${url("/masuk")}" class="px-2 text-sm font-semibold text-ink">Masuk</a>`;

  return `<header class="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
    <div class="container-page flex h-16 items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-4">
        ${brandMarkHtml()}
        <span class="hidden border-l border-line pl-4 font-mono text-[10px] leading-tight text-muted xl:block">${escapeHtml(
          campus?.name ?? "",
        )}<br>${escapeHtml(campus?.city ?? "")}</span>
      </div>
      <nav class="hidden lg:block" aria-label="Navigasi utama">${navLinksHtml({ variant: "top", isAdmin: profile?.role === "admin", activePath })}</nav>
      <div class="flex items-center gap-2">
        ${isDemo ? badge("Mode demo", { variant: "signal", className: "hidden sm:inline-flex" }) : ""}
        <a href="${url("/tempat/baru")}" class="${buttonClass({ variant: "primary", size: "sm", className: "hidden xl:inline-flex" })}">${icon(
          "plus",
          "h-4 w-4",
        )} Tambah tempat</a>
        <a href="${url("/tempat/baru")}" aria-label="Tambah tempat" class="grid h-10 w-10 place-items-center rounded-sm border border-ink bg-signal text-ink xl:hidden">${icon(
          "plus",
          "h-5 w-5",
        )}</a>
        ${account}
        <div class="relative lg:hidden" data-mobile-menu>
          <button type="button" aria-expanded="false" aria-controls="mobile-site-menu" aria-label="Buka menu" class="grid h-10 w-10 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:bg-paper-deep" data-mobile-toggle>${icon(
            "menu",
            "h-5 w-5",
          )}</button>
          <div id="mobile-site-menu" hidden class="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-line bg-surface p-3 shadow-lift">
            <nav aria-label="Navigasi utama seluler">${navLinksHtml({ variant: "sidebar", isAdmin: profile?.role === "admin", activePath })}</nav>
            <a href="${url("/tempat/baru")}" class="${buttonClass({ variant: "primary", size: "md", className: "mt-3 w-full" })}">${icon(
              "plus",
              "h-4 w-4",
            )} Tambah tempat</a>
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

export function siteFooterHtml() {
  return `<footer class="border-t border-line bg-paper-deep/45">
    <div class="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        ${brandMarkHtml()}
        <p class="mt-4 max-w-[42ch] text-sm leading-relaxed text-muted">Peta komunitas untuk mahasiswa ITPLN. Temukan tempat yang masuk akal, lalu bagikan pengalamanmu supaya yang lain tidak perlu menebak.</p>
        <p class="mt-4 font-mono text-[10px] text-muted">Dibuat untuk Institut Teknologi PLN, Jakarta Barat.</p>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold">Jelajahi</h2>
        <ul class="mt-3 space-y-2 text-sm text-muted">
          <li><a href="${url("/jelajah")}" class="hover:text-ink">Peta tempat</a></li>
          <li><a href="${url("/linimasa")}" class="hover:text-ink">Linimasa kampus</a></li>
          <li><a href="${url("/simpan")}" class="hover:text-ink">Tempat tersimpan</a></li>
          <li><a href="${url("/tempat/baru")}" class="hover:text-ink">Tambah tempat</a></li>
        </ul>
      </div>
      <div>
        <h2 class="font-display text-lg font-semibold">Tentang data</h2>
        <ul class="mt-3 space-y-2 text-sm text-muted">
          <li><a href="https://www.openstreetmap.org/copyright" class="hover:text-ink" target="_blank" rel="noreferrer">© OpenStreetMap contributors, ODbL</a></li>
          <li><a href="${url("/setup")}" class="hover:text-ink">Panduan Supabase</a></li>
          <li><a href="${url("/masuk")}" class="hover:text-ink">Masuk</a></li>
        </ul>
      </div>
    </div>
  </footer>`;
}

export function mountShell({ profile, campus, isDemo }) {
  const topbar = document.getElementById("topbar");
  if (topbar) topbar.innerHTML = topBarHtml({ profile, campus, isDemo });

  const banner = document.getElementById("demo-banner");
  if (banner) banner.innerHTML = demoBannerHtml(isDemo);

  const footer = document.getElementById("footer");
  if (footer) footer.innerHTML = siteFooterHtml();

  const menu = document.querySelector("[data-mobile-menu]");
  if (menu) {
    const toggle = menu.querySelector("[data-mobile-toggle]");
    const panel = menu.querySelector("#mobile-site-menu");
    toggle?.addEventListener("click", () => {
      const open = panel.hasAttribute("hidden");
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open
        ? '<i data-lucide="x" class="h-5 w-5" aria-hidden="true"></i>'
        : '<i data-lucide="menu" class="h-5 w-5" aria-hidden="true"></i>';
      refreshIcons();
    });
  }

  refreshIcons();
}
