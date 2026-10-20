import type { Metadata } from "next";
import Link from "next/link";
import { FeedClient } from "@/components/feed/feed-client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { getDefaultCampus } from "@/lib/data/campuses";
import { getPlaces } from "@/lib/data/places";
import { getPosts } from "@/lib/data/posts";
import { ROLE_LABELS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Linimasa kampus",
  description:
    "Cerita, tips, promo, dan info dari mahasiswa di sekitar Institut Teknologi PLN.",
};

export default async function LinimasaPage() {
  const current = await getCurrentUser();
  const campus = await getDefaultCampus();
  const [posts, places] = await Promise.all([
    getPosts({ campusId: campus.id, userId: current.user?.id ?? null, limit: 40 }),
    getPlaces(),
  ]);

  const contributors = Array.from(
    posts.reduce((map, post) => {
      const existing = map.get(post.author.id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(post.author.id, { ...post.author, count: 1 });
      }
      return map;
    }, new Map<string, { id: string; name: string; avatar_url: string | null; role: string; count: number }>()),
  )
    .map(([, value]) => value)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return (
    <div className="container-page py-6 lg:py-8">
      <header className="flex flex-col gap-3 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
            <span className="font-mono text-[11px] text-muted">{campus.name}</span>
            {current.isDemo ? <Badge variant="signal">Data demo</Badge> : null}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Linimasa kampus.
          </h1>
          <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted">
            Info dari mahasiswa, untuk mahasiswa. Sebut tempatnya, jelaskan yang berguna, dan
            jangan bagikan data pribadi orang lain.
          </p>
        </div>

        <Link
          href="/jelajah"
          className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
        >
          Cari tempat di peta
        </Link>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 max-w-[760px]">
          <FeedClient
            posts={posts}
            places={places}
            currentUserId={current.user?.id ?? null}
            isDemo={current.isDemo}
            campusName={campus.name}
          />
        </div>

        <aside aria-label="Panduan dan kontributor" className="space-y-8">
          <section className="border-t border-line pt-4">
            <h2 className="font-display text-xl font-semibold">Aturan singkat</h2>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <li>
                <span className="font-medium text-ink">Sebut tempatnya.</span> Nama, patokan, dan
                kisaran harga lebih berguna daripada “dekat kampus”.
              </li>
              <li>
                <span className="font-medium text-ink">Jangan doxing.</span> Jangan bagikan nomor
                pribadi, alamat kos, atau foto orang tanpa izin.
              </li>
              <li>
                <span className="font-medium text-ink">Beri tahu kalau berubah.</span> Harga naik
                atau tempat tutup? Laporkan lewat halaman tempat.
              </li>
            </ul>
          </section>

          <section className="border-t border-line pt-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">Kontributor</h2>
              <span className="font-mono text-[10px] text-muted">Minggu ini</span>
            </div>
            <ul className="mt-3 space-y-3">
              {contributors.map((person) => (
                <li key={person.id} className="flex items-center gap-3">
                  <Avatar
                    name={person.name}
                    src={person.avatar_url}
                    size="sm"
                    decorative
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{person.name}</p>
                    <p className="text-xs text-muted">
                      {person.role === "admin"
                        ? ROLE_LABELS.admin
                        : person.role === "pemilik"
                          ? ROLE_LABELS.pemilik
                          : ROLE_LABELS.mahasiswa}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-muted">{person.count}</span>
                </li>
              ))}
            </ul>
            {contributors.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Belum ada kontributor.</p>
            ) : null}
          </section>

          <section className="border-t border-line pt-4">
            <h2 className="font-display text-xl font-semibold">Cari yang belum ada?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Tambahkan tempat baru. Setelah diverifikasi admin, tempat itu bisa dibahas di
              linimasa.
            </p>
            <Link
              href="/tempat/baru"
              className="mt-3 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
            >
              Tambah tempat
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
