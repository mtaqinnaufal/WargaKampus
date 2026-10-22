import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PostPreview } from "@/components/feed/post-preview";
import { PlaceGridCard } from "@/components/places/place-grid-card";
import { ProfileForm } from "@/components/profile/profile-form";
import { Reveal } from "@/components/reveal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { requireUser } from "@/lib/auth";
import { getCampuses } from "@/lib/data/campuses";
import { getContributions } from "@/lib/data/profile";
import { ROLE_LABELS } from "@/lib/constants";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil, kontribusi, dan pengaturan akun WargaKampus.",
};

export default async function ProfilePage() {
  const current = await requireUser();
  const [campuses, contributions] = await Promise.all([
    getCampuses(),
    getContributions(current.profile.id),
  ]);

  const profile = current.profile;
  const campus = campuses.find((item) => item.id === profile.campus_id) ?? campuses[0];
  const joined = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
    new Date(profile.created_at),
  );

  return (
    <div className="container-page py-6 lg:py-8">
      <header className="relative overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)] sm:p-6 lg:p-8">
        <div
          className="grid-paper pointer-events-none absolute inset-0 opacity-20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar
            name={profile.name}
            src={profile.avatar_url}
            size="xl"
            decorative
            className="ring-4 ring-signal/25 ring-offset-2 ring-offset-surface"
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Profil komunitas
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{ROLE_LABELS[profile.role]}</Badge>
              {current.isDemo ? <Badge variant="signal">Mode demo</Badge> : null}
              {profile.role === "admin" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-ink underline underline-offset-2"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Buka admin
                </Link>
              ) : null}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {campus ? `${campus.name} · ${campus.city}` : "Kampus belum dipilih"}
              {" · "}
              Bergabung {joined}
            </p>
            {profile.bio ? (
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                {profile.bio}
              </p>
            ) : null}
          </div>
        </div>

        <dl className="relative mt-6 grid max-w-xl grid-cols-3 gap-3">
          <div className="rounded-lg border border-line bg-paper/70 px-4 py-3">
            <dt className="text-[10px] text-muted">Tempat</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
              {contributions.places.length}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-paper/70 px-4 py-3">
            <dt className="text-[10px] text-muted">Postingan</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
              {contributions.posts.length}
            </dd>
          </div>
          <div className="rounded-lg border border-line bg-paper/70 px-4 py-3">
            <dt className="text-[10px] text-muted">Ulasan</dt>
            <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
              {contributions.reviews.length}
            </dd>
          </div>
        </dl>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Reveal>
            <section
              aria-labelledby="my-places-title"
              className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="my-places-title" className="font-display text-2xl font-semibold">
                    Tempat yang saya tambahkan
                  </h2>
                  {profile.role === "pemilik" ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      Kelola banner, pricelist, dan foto dari halaman detail tempat.
                    </p>
                  ) : null}
                </div>
                <span className="font-mono text-[10px] text-muted">
                  {contributions.places.length} tempat
                </span>
              </div>

              {contributions.places.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {contributions.places.map((place) => (
                    <PlaceGridCard key={place.id} place={place} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5">
                  <p className="text-sm text-muted">
                    Belum ada tempat. Tambahkan tempat yang belum ada di peta.
                  </p>
                  <Link
                    href="/tempat/baru"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink"
                  >
                    Tambah tempat
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>
          </Reveal>

          <Reveal delay={80}>
            <section
              aria-labelledby="my-posts-title"
              className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 id="my-posts-title" className="font-display text-2xl font-semibold">
                  Postingan saya
                </h2>
                <span className="font-mono text-[10px] text-muted">
                  {contributions.posts.length} cerita
                </span>
              </div>
              {contributions.posts.length > 0 ? (
                <div className="mt-2">
                  {contributions.posts.map((post) => (
                    <PostPreview key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5">
                  <p className="text-sm text-muted">
                    Belum ada postingan. Bagikan satu info yang kamu ingin temukan sendiri waktu
                    pertama kali sampai di Jakarta.
                  </p>
                  <Link
                    href="/linimasa"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink"
                  >
                    Buka linimasa
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>
          </Reveal>

          <Reveal delay={140}>
            <section
              aria-labelledby="my-reviews-title"
              className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]"
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 id="my-reviews-title" className="font-display text-2xl font-semibold">
                  Ulasan saya
                </h2>
                <span className="font-mono text-[10px] text-muted">
                  {contributions.reviews.length} ulasan
                </span>
              </div>
              {contributions.reviews.length > 0 ? (
                <div className="mt-2">
                  {contributions.reviews.map((review) => (
                    <article
                      key={review.id}
                      className="border-b border-line py-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <StarRating rating={review.rating} showCount={false} />
                        {review.place ? (
                          <Link
                            href={`/tempat/${review.place.slug}`}
                            className="text-sm font-medium text-ink hover:underline"
                          >
                            {review.place.name}
                          </Link>
                        ) : null}
                        <time
                          dateTime={review.created_at}
                          className="text-xs text-muted"
                          suppressHydrationWarning
                        >
                          {relativeTime(review.created_at)}
                        </time>
                      </div>
                      {review.body ? (
                        <p className="prose-kp mt-2 text-sm text-ink-soft">{review.body}</p>
                      ) : null}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-line-strong bg-paper/60 p-5">
                  <p className="text-sm text-muted">
                    Belum ada ulasan. Ulasan pertama bisa dimulai dari tempat yang paling sering
                    kamu datangi.
                  </p>
                  <Link
                    href="/jelajah"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink"
                  >
                    Cari tempat
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>
          </Reveal>
        </div>

        <aside aria-label="Pengaturan profil" className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <h2 className="font-display text-xl font-semibold">Edit profil</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Nama dan bio terlihat oleh pengguna lain. Email hanya untuk akun.
            </p>
            <div className="mt-4">
              <ProfileForm
                profile={profile}
                campuses={campuses}
                email={current.user?.email}
                isDemo={current.isDemo}
              />
            </div>
          </section>

          <section className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
            <h2 className="font-display text-xl font-semibold">Akun</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Peran</dt>
                <dd>{ROLE_LABELS[profile.role]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Kampus</dt>
                <dd className="text-right">{campus?.name ?? "Belum dipilih"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Reputasi</dt>
                <dd className="font-mono">{profile.reputation_points}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
