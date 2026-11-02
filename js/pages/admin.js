// Admin page. Ported from src/app/(app)/admin/page.tsx.
import { initPage, mainEl, showError } from "../page-common.js";
import { getAdminData } from "../api/admin.js";
import { getCampuses } from "../api/campuses.js";
import { resolveReport, updateRole, verifyPlace } from "../actions/admin.js";
import { ROLE_LABELS, url } from "../config.js";
import { escapeHtml, relativeTime } from "../utils.js";
import { avatar, badge, buttonClass, formMessage, inputClass, statusBadge } from "../components/ui.js";
import { icon, refreshIcons } from "../components/icons.js";

const REPORT_TARGET_LABELS = {
  place: "Tempat",
  post: "Postingan",
  comment: "Komentar",
  user: "Pengguna",
};

const ROLE_OPTIONS = [
  { value: "mahasiswa", label: "Mahasiswa" },
  { value: "pemilik", label: "Pemilik usaha" },
  { value: "admin", label: "Admin" },
];

const { current } = await initPage();

if (!current.profile) {
  window.location.assign(url("/masuk?next=/admin"));
} else if (current.profile.role !== "admin") {
  window.location.assign(url("/jelajah"));
} else {
  const isDemo = Boolean(current.isDemo);

  try {
    const [data, campuses] = await Promise.all([getAdminData(), getCampuses()]);
    render(data, { isDemo, campuses });
  } catch (error) {
    showError(mainEl(), error instanceof Error ? error.message : "");
  }
}

function render(data, { isDemo, campuses }) {
  const campusName = new Map(campuses.map((campus) => [campus.id, campus.name]));

  const pendingRows = data.pendingPlaces
    .map(
      (place) => `<tr class="border-b border-line align-top" data-place-row="${escapeHtml(place.id)}">
        <td class="py-4 pr-4">
          <p class="font-medium text-ink">${escapeHtml(place.name)}</p>
          <p class="mt-0.5 max-w-[38ch] text-xs text-muted">${escapeHtml(place.address)}</p>
          <div class="mt-1">${statusBadge(place.status)}</div>
        </td>
        <td class="py-4 pr-4 text-xs text-muted">${escapeHtml(place.category?.name ?? "")}</td>
        <td class="py-4 pr-4 text-xs text-muted">${place.source === "osm" ? "OpenStreetMap" : "Komunitas"}</td>
        <td class="py-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label for="note-${escapeHtml(place.id)}" class="sr-only">Catatan verifikasi</label>
            <input id="note-${escapeHtml(
              place.id,
            )}" name="note" placeholder="Catatan (opsional)" class="${inputClass} h-9 w-full min-w-40 text-xs sm:w-48">
            <div class="flex gap-2">
              <button type="button" data-verify="approve" data-place-id="${escapeHtml(
                place.id,
              )}" class="${buttonClass({ variant: "primary", size: "sm" })}">Setujui</button>
              <button type="button" data-verify="reject" data-place-id="${escapeHtml(
                place.id,
              )}" class="${buttonClass({ variant: "danger", size: "sm" })}">Tolak</button>
            </div>
          </div>
          <div data-row-message class="mt-2"></div>
        </td>
      </tr>`,
    )
    .join("");

  const reportRows = data.reports
    .map(
      (report) => `<tr class="border-b border-line align-top" data-report-row="${escapeHtml(report.id)}">
        <td class="py-4 pr-4">
          <p class="font-medium text-ink">${escapeHtml(
            REPORT_TARGET_LABELS[report.target_type] ?? report.target_type,
          )}</p>
          <p class="mt-0.5 font-mono text-[10px] text-muted">${escapeHtml(
            String(report.target_id ?? "").slice(0, 8),
          )}…</p>
          <p class="mt-1 text-xs text-muted">${escapeHtml(relativeTime(report.created_at))}</p>
        </td>
        <td class="max-w-[34ch] py-4 pr-4 text-xs leading-relaxed text-ink-soft">${escapeHtml(
          report.reason,
        )}</td>
        <td class="py-4 pr-4">
          <div class="flex items-center gap-2">
            ${avatar({ name: report.reporter?.name ?? "Pengguna", size: "xs", decorative: true })}
            <span class="text-xs text-muted">${escapeHtml(report.reporter?.name ?? "Pengguna")}</span>
          </div>
        </td>
        <td class="py-4">
          <div class="flex flex-wrap gap-2">
            <button type="button" data-report="reviewed" data-report-id="${escapeHtml(
              report.id,
            )}" class="${buttonClass({ variant: "outline", size: "sm" })}">Tinjau</button>
            <button type="button" data-report="actioned" data-report-id="${escapeHtml(
              report.id,
            )}" class="${buttonClass({ variant: "primary", size: "sm" })}">Tindak</button>
            <button type="button" data-report="rejected" data-report-id="${escapeHtml(
              report.id,
            )}" class="${buttonClass({ variant: "ghost", size: "sm" })}">Tolak</button>
          </div>
          <div data-row-message class="mt-2"></div>
        </td>
      </tr>`,
    )
    .join("");

  const userRows = data.users
    .map(
      (user) => `<tr class="border-b border-line align-middle" data-user-row="${escapeHtml(user.id)}">
        <td class="py-3 pr-4">
          <div class="flex items-center gap-2">
            ${avatar({ name: user.name, src: user.avatar_url, size: "xs", decorative: true })}
            <div>
              <p class="font-medium text-ink">${escapeHtml(user.name)}</p>
              <p class="text-[10px] text-muted">${user.is_active ? "Aktif" : "Nonaktif"}</p>
            </div>
          </div>
        </td>
        <td class="py-3 pr-4 text-xs text-muted">${
          user.campus_id ? escapeHtml(campusName.get(user.campus_id) ?? "Kampus terdaftar") : "-"
        }</td>
        <td class="py-3 pr-4">${badge(escapeHtml(ROLE_LABELS[user.role] ?? user.role ?? ""), {
          variant: user.role === "admin" ? "ink" : "outline",
        })}</td>
        <td class="py-3">
          <div class="flex items-center gap-2">
            <label for="role-${escapeHtml(user.id)}" class="sr-only">Peran untuk ${escapeHtml(
              user.name,
            )}</label>
            <select id="role-${escapeHtml(
              user.id,
            )}" data-role-select class="${inputClass} h-9 cursor-pointer pr-9 w-36 text-xs">
              ${ROLE_OPTIONS.map(
                (option) =>
                  `<option value="${option.value}" ${
                    user.role === option.value ? "selected" : ""
                  }>${escapeHtml(option.label)}</option>`,
              ).join("")}
            </select>
            <button type="button" data-save-role data-user-id="${escapeHtml(
              user.id,
            )}" class="${buttonClass({ variant: "outline", size: "sm" })}">${icon(
              "check-circle-2",
              "h-3.5 w-3.5",
            )} Simpan</button>
          </div>
          <div data-row-message class="mt-2"></div>
        </td>
      </tr>`,
    )
    .join("");

  const auditHtml = data.auditLogs.length
    ? `<ul class="mt-2">${data.auditLogs
        .map(
          (log) => `<li class="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="font-mono text-xs text-ink">${escapeHtml(log.action)}</p>
              <p class="text-xs text-muted">${escapeHtml(log.target_type)}${
                log.target_id ? ` · ${escapeHtml(String(log.target_id).slice(0, 8))}…` : ""
              }${log.note ? ` · ${escapeHtml(log.note)}` : ""}</p>
            </div>
            <p class="text-xs text-muted">${escapeHtml(log.admin?.name ?? "Admin")} · ${escapeHtml(
              relativeTime(log.created_at),
            )}</p>
          </li>`,
        )
        .join("")}</ul>`
    : `<p class="mt-4 text-sm text-muted">Belum ada tindakan admin.</p>`;

  mainEl().innerHTML = `<div class="container-page py-6 lg:py-8">
    <header class="flex flex-col gap-3 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          ${icon("shield-check", "h-4 w-4 text-ink")}
          <span class="font-mono text-[11px] text-muted">Moderasi komunitas</span>
          ${isDemo ? badge("Mode demo", { variant: "signal" }) : ""}
        </div>
        <h1 class="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">Admin WargaKampus.</h1>
        <p class="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">Tinjau tempat baru, tangani laporan, dan jaga peran pengguna. Setiap tindakan tercatat di audit log.</p>
      </div>
      <a href="${url("/jelajah")}" class="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4">Lihat sisi pengguna</a>
    </header>

    ${
      isDemo
        ? `<div class="mt-4 border border-signal bg-signal/20 px-3 py-2 text-sm leading-relaxed text-ink" role="status">Mode demo: tombol admin bisa dicoba, tetapi data contoh tidak berubah. Sambungkan Supabase untuk moderasi sungguhan.</div>`
        : ""
    }

    <dl class="mt-6 grid grid-cols-2 divide-x divide-line border-y border-line sm:grid-cols-4">
      <div class="py-4 pr-4">
        <dt class="flex items-center gap-1.5 text-xs text-muted">${icon(
          "clock-3",
          "h-3.5 w-3.5",
        )} Menunggu verifikasi</dt>
        <dd class="mt-1 font-mono text-2xl font-semibold">${data.stats.pendingPlaces}</dd>
      </div>
      <div class="px-4 py-4">
        <dt class="flex items-center gap-1.5 text-xs text-muted">${icon(
          "alert-triangle",
          "h-3.5 w-3.5",
        )} Laporan terbuka</dt>
        <dd class="mt-1 font-mono text-2xl font-semibold">${data.stats.openReports}</dd>
      </div>
      <div class="py-4 pl-4 sm:px-4">
        <dt class="flex items-center gap-1.5 text-xs text-muted">${icon(
          "users",
          "h-3.5 w-3.5",
        )} Pengguna</dt>
        <dd class="mt-1 font-mono text-2xl font-semibold">${data.stats.totalUsers}</dd>
      </div>
      <div class="py-4 pl-4">
        <dt class="flex items-center gap-1.5 text-xs text-muted">${icon(
          "file-clock",
          "h-3.5 w-3.5",
        )} Postingan</dt>
        <dd class="mt-1 font-mono text-2xl font-semibold">${data.stats.totalPosts}</dd>
      </div>
    </dl>

    <section class="mt-10" aria-labelledby="pending-title">
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <h2 id="pending-title" class="font-display text-2xl font-semibold">Antrean tempat</h2>
        <span class="font-mono text-[11px] text-muted">${data.pendingPlaces.length} menunggu</span>
      </div>
      ${
        data.pendingPlaces.length > 0
          ? `<div class="overflow-x-auto">
              <table class="mt-2 min-w-full text-sm">
                <thead>
                  <tr class="border-b border-line text-left text-xs text-muted">
                    <th scope="col" class="py-2 pr-4 font-medium">Tempat</th>
                    <th scope="col" class="py-2 pr-4 font-medium">Kategori</th>
                    <th scope="col" class="py-2 pr-4 font-medium">Sumber</th>
                    <th scope="col" class="py-2 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>${pendingRows}</tbody>
              </table>
            </div>`
          : `<p class="mt-4 text-sm text-muted">Tidak ada tempat yang menunggu verifikasi.</p>`
      }
    </section>

    <section class="mt-10" aria-labelledby="reports-title">
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <h2 id="reports-title" class="font-display text-2xl font-semibold">Laporan</h2>
        <span class="font-mono text-[11px] text-muted">${data.reports.length} laporan</span>
      </div>
      ${
        data.reports.length > 0
          ? `<div class="overflow-x-auto">
              <table class="mt-2 min-w-full text-sm">
                <thead>
                  <tr class="border-b border-line text-left text-xs text-muted">
                    <th scope="col" class="py-2 pr-4 font-medium">Target</th>
                    <th scope="col" class="py-2 pr-4 font-medium">Alasan</th>
                    <th scope="col" class="py-2 pr-4 font-medium">Pelapor</th>
                    <th scope="col" class="py-2 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>${reportRows}</tbody>
              </table>
            </div>`
          : `<p class="mt-4 text-sm text-muted">Tidak ada laporan terbuka.</p>`
      }
    </section>

    <section class="mt-10" aria-labelledby="users-title">
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <h2 id="users-title" class="font-display text-2xl font-semibold">Pengguna</h2>
        <span class="font-mono text-[11px] text-muted">${data.users.length} akun</span>
      </div>
      <div class="overflow-x-auto">
        <table class="mt-2 min-w-full text-sm">
          <thead>
            <tr class="border-b border-line text-left text-xs text-muted">
              <th scope="col" class="py-2 pr-4 font-medium">Pengguna</th>
              <th scope="col" class="py-2 pr-4 font-medium">Kampus</th>
              <th scope="col" class="py-2 pr-4 font-medium">Peran</th>
              <th scope="col" class="py-2 font-medium">Ubah</th>
            </tr>
          </thead>
          <tbody>${userRows}</tbody>
        </table>
      </div>
    </section>

    <section class="mt-10" aria-labelledby="audit-title">
      <div class="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
        <h2 id="audit-title" class="font-display text-2xl font-semibold">Audit log</h2>
        <span class="font-mono text-[11px] text-muted">20 terbaru</span>
      </div>
      ${auditHtml}
    </section>
  </div>`;

  wire();
  refreshIcons();
}

function rowMessage(row, message, ok = false) {
  const el = row?.querySelector("[data-row-message]");
  if (el) {
    el.innerHTML = formMessage(message, { ok });
    refreshIcons();
  }
}

function wire() {
  const root = mainEl();

  // Antrean tempat: approve / reject.
  root.querySelectorAll("[data-verify]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-place-row]");
      const placeId = button.dataset.placeId;
      const action = button.dataset.verify;
      const note = row?.querySelector("input[name=note]")?.value ?? "";
      const buttons = row?.querySelectorAll("[data-verify]") ?? [];
      buttons.forEach((b) => (b.disabled = true));
      const result = await verifyPlace(placeId, action, note);
      if (result.ok) {
        window.location.reload();
        return;
      }
      rowMessage(row, result.message);
      buttons.forEach((b) => (b.disabled = false));
    });
  });

  // Laporan: reviewed / actioned / rejected.
  root.querySelectorAll("[data-report]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-report-row]");
      const reportId = button.dataset.reportId;
      const action = button.dataset.report;
      const buttons = row?.querySelectorAll("[data-report]") ?? [];
      buttons.forEach((b) => (b.disabled = true));
      const result = await resolveReport(reportId, action);
      if (result.ok) {
        window.location.reload();
        return;
      }
      rowMessage(row, result.message);
      buttons.forEach((b) => (b.disabled = false));
    });
  });

  // Pengguna: save role.
  root.querySelectorAll("[data-save-role]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-user-row]");
      const userId = button.dataset.userId;
      const role = row?.querySelector("[data-role-select]")?.value ?? "";
      button.disabled = true;
      const result = await updateRole(userId, role);
      if (result.ok) {
        window.location.reload();
        return;
      }
      rowMessage(row, result.message);
      button.disabled = false;
    });
  });
}
