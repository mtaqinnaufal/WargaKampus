// Shared page bootstrap: resolve current user + campus, mount the shell.
import { getCurrentUser } from "./auth.js";
import { getDefaultCampus } from "./api/campuses.js";
import { mountShell } from "./components/shell.js";
import { refreshIcons } from "./components/icons.js";

export async function initPage() {
  const [current, campus] = await Promise.all([getCurrentUser(), getDefaultCampus()]);
  mountShell({ profile: current.profile, campus, isDemo: current.isDemo });
  refreshIcons();
  return { current, campus };
}

export const mainEl = () => document.getElementById("main");

export function showError(container, message) {
  if (!container) return;
  container.innerHTML = `<div class="container-page py-16" role="alert"><p class="font-mono text-[11px] text-muted">Terjadi kesalahan</p><h1 class="mt-2 max-w-[20ch] font-display text-3xl font-bold leading-tight sm:text-4xl">Halaman ini tidak bisa dimuat.</h1><p class="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">${message ?? ""}</p></div>`;
}
