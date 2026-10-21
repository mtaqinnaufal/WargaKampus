import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileClock,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  resolveReportFormAction,
  updateRoleFormAction,
  verifyPlaceFormAction,
} from "@/app/actions/admin";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { getAdminData } from "@/lib/data/admin";
import { getCampuses } from "@/lib/data/campuses";
import { ROLE_LABELS } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  description: "Antrean verifikasi, laporan, dan moderasi komunitas WargaKampus.",
};

const reportTargetLabels: Record<string, string> = {
  place: "Tempat",
  post: "Postingan",
  comment: "Komentar",
  user: "Pengguna",
};

export default async function AdminPage() {
  const current = await requireAdmin();
  const [data, campuses] = await Promise.all([getAdminData(), getCampuses()]);
  const campusName = new Map(campuses.map((campus) => [campus.id, campus.name]));

  return (
    <div className="container-page py-6 lg:py-8">
      <header className="flex flex-col gap-3 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-ink" aria-hidden="true" />
            <span className="font-mono text-[11px] text-muted">Moderasi komunitas</span>
            {current.isDemo ? <Badge variant="signal">Mode demo</Badge> : null}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Admin WargaKampus.
          </h1>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">
            Tinjau tempat baru, tangani laporan, dan jaga peran pengguna. Setiap tindakan
            tercatat di audit log.
          </p>
        </div>
        <Link
          href="/jelajah"
          className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
        >
          Lihat sisi pengguna
        </Link>
      </header>

      {current.isDemo ? (
        <div className="mt-4 border border-signal bg-signal/20 px-3 py-2 text-sm leading-relaxed text-ink" role="status">
          Mode demo: tombol admin bisa dicoba, tetapi data contoh tidak berubah. Sambungkan
          Supabase untuk moderasi sungguhan.
        </div>
      ) : null}

      <dl className="mt-6 grid grid-cols-2 divide-x divide-line border-y border-line sm:grid-cols-4">
        <div className="py-4 pr-4">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            Menunggu verifikasi
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold">{data.stats.pendingPlaces}</dd>
        </div>
        <div className="px-4 py-4">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Laporan terbuka
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold">{data.stats.openReports}</dd>
        </div>
        <div className="py-4 pl-4 sm:px-4">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Pengguna
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold">{data.stats.totalUsers}</dd>
        </div>
        <div className="py-4 pl-4">
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
            Postingan
          </dt>
          <dd className="mt-1 font-mono text-2xl font-semibold">{data.stats.totalPosts}</dd>
        </div>
      </dl>

      <section className="mt-10" aria-labelledby="pending-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 id="pending-title" className="font-display text-2xl font-semibold">
            Antrean tempat
          </h2>
          <span className="font-mono text-[11px] text-muted">
            {data.pendingPlaces.length} menunggu
          </span>
        </div>

        {data.pendingPlaces.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="mt-2 min-w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th scope="col" className="py-2 pr-4 font-medium">Tempat</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Kategori</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Sumber</th>
                  <th scope="col" className="py-2 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.pendingPlaces.map((place) => (
                  <tr key={place.id} className="border-b border-line align-top">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-ink">{place.name}</p>
                      <p className="mt-0.5 max-w-[38ch] text-xs text-muted">{place.address}</p>
                      <div className="mt-1">
                        <StatusBadge status={place.status} />
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-xs text-muted">{place.category.name}</td>
                    <td className="py-4 pr-4 text-xs text-muted">
                      {place.source === "osm" ? "OpenStreetMap" : "Komunitas"}
                    </td>
                    <td className="py-4">
                      <form action={verifyPlaceFormAction} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input type="hidden" name="place_id" value={place.id} />
                        <label htmlFor={`note-${place.id}`} className="sr-only">
                          Catatan verifikasi
                        </label>
                        <Input
                          id={`note-${place.id}`}
                          name="note"
                          placeholder="Catatan (opsional)"
                          className="h-9 w-full min-w-40 text-xs sm:w-48"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            name="action"
                            value="approve"
                            className={buttonClass({ variant: "primary", size: "sm" })}
                          >
                            Setujui
                          </button>
                          <button
                            type="submit"
                            name="action"
                            value="reject"
                            className={buttonClass({ variant: "danger", size: "sm" })}
                          >
                            Tolak
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Tidak ada tempat yang menunggu verifikasi.</p>
        )}
      </section>

      <section className="mt-10" aria-labelledby="reports-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 id="reports-title" className="font-display text-2xl font-semibold">
            Laporan
          </h2>
          <span className="font-mono text-[11px] text-muted">{data.reports.length} laporan</span>
        </div>

        {data.reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="mt-2 min-w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th scope="col" className="py-2 pr-4 font-medium">Target</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Alasan</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Pelapor</th>
                  <th scope="col" className="py-2 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.reports.map((report) => (
                  <tr key={report.id} className="border-b border-line align-top">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-ink">
                        {reportTargetLabels[report.target_type] ?? report.target_type}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted">
                        {report.target_id.slice(0, 8)}…
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {relativeTime(report.created_at)}
                      </p>
                    </td>
                    <td className="max-w-[34ch] py-4 pr-4 text-xs leading-relaxed text-ink-soft">
                      {report.reason}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={report.reporter?.name ?? "Pengguna"}
                          size="xs"
                          decorative
                        />
                        <span className="text-xs text-muted">
                          {report.reporter?.name ?? "Pengguna"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <form action={resolveReportFormAction} className="flex flex-wrap gap-2">
                        <input type="hidden" name="report_id" value={report.id} />
                        <button
                          type="submit"
                          name="action"
                          value="reviewed"
                          className={buttonClass({ variant: "outline", size: "sm" })}
                        >
                          Tinjau
                        </button>
                        <button
                          type="submit"
                          name="action"
                          value="actioned"
                          className={buttonClass({ variant: "primary", size: "sm" })}
                        >
                          Tindak
                        </button>
                        <button
                          type="submit"
                          name="action"
                          value="rejected"
                          className={buttonClass({ variant: "ghost", size: "sm" })}
                        >
                          Tolak
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Tidak ada laporan terbuka.</p>
        )}
      </section>

      <section className="mt-10" aria-labelledby="users-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 id="users-title" className="font-display text-2xl font-semibold">
            Pengguna
          </h2>
          <span className="font-mono text-[11px] text-muted">{data.users.length} akun</span>
        </div>

        <div className="overflow-x-auto">
          <table className="mt-2 min-w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th scope="col" className="py-2 pr-4 font-medium">Pengguna</th>
                <th scope="col" className="py-2 pr-4 font-medium">Kampus</th>
                <th scope="col" className="py-2 pr-4 font-medium">Peran</th>
                <th scope="col" className="py-2 font-medium">Ubah</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id} className="border-b border-line align-middle">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={user.name} src={user.avatar_url} size="xs" decorative />
                      <div>
                        <p className="font-medium text-ink">{user.name}</p>
                        <p className="text-[10px] text-muted">
                          {user.is_active ? "Aktif" : "Nonaktif"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-muted">
                    {user.campus_id ? campusName.get(user.campus_id) ?? "Kampus terdaftar" : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={user.role === "admin" ? "ink" : "outline"}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <form action={updateRoleFormAction} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={user.id} />
                      <label htmlFor={`role-${user.id}`} className="sr-only">
                        Peran untuk {user.name}
                      </label>
                      <Select
                        id={`role-${user.id}`}
                        name="role"
                        defaultValue={user.role}
                        className="h-9 w-36 text-xs"
                      >
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="pemilik">Pemilik usaha</option>
                        <option value="admin">Admin</option>
                      </Select>
                      <button
                        type="submit"
                        className={buttonClass({ variant: "outline", size: "sm" })}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Simpan
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="audit-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 id="audit-title" className="font-display text-2xl font-semibold">
            Audit log
          </h2>
          <span className="font-mono text-[11px] text-muted">20 terbaru</span>
        </div>

        {data.auditLogs.length > 0 ? (
          <ul className="mt-2">
            {data.auditLogs.map((log) => (
              <li key={log.id} className="flex flex-col gap-1 border-b border-line py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs text-ink">{log.action}</p>
                  <p className="text-xs text-muted">
                    {log.target_type}
                    {log.target_id ? ` · ${log.target_id.slice(0, 8)}…` : ""}
                    {log.note ? ` · ${log.note}` : ""}
                  </p>
                </div>
                <p className="text-xs text-muted">
                  {log.admin?.name ?? "Admin"} · {relativeTime(log.created_at)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Belum ada tindakan admin.</p>
        )}
      </section>
    </div>
  );
}
