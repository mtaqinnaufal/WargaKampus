import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { PostPreview } from "@/components/feed/post-preview";
import { PlaceTile } from "@/components/places/place-tile";
import { ProfileForm } from "@/components/profile/profile-form";
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
      <header className="border-b border-line pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={profile.name} src={profile.avatar_url} size="xl" decorative />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
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

        <dl className="mt-6 grid max-w-xl grid-cols-3 divide-x divide-line border-y border-line">
          <div className="py-3 pr-4">
            <dt className="text-xs text-muted">Tempat</dt>
            <dd className="mt-1 font-mono text-xl font-semibold">{contributions.places.length}</dd>
          </div>
          <div className="px-4 py-3">
            <dt className="text-xs text-muted">Postingan</dt>
            <dd className="mt-1 font-mono text-xl font-semibold">{contributions.posts.length}</dd>
          </div>
          <div className="py-3 pl-4">
            <dt className="text-xs text-muted">Ulasan</dt>
            <dd className="mt-1 font-mono text-xl font-semibold">{contributions.reviews.length}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <section aria-labelledby="my-places-title">
            <h2 id="my-places-title" className="border-b border-line pb-3 font-display text-2xl font-semibold">
              Tempat yang saya tambahkan
            </h2>
            {contributions.places.length > 0 ? (
              <div className="mt-4">
                {contributions.places.map((place) => (
                  <PlaceTile key={place.id} place={place} />
                ))}
              </div>
            ) : (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-sm text-muted">
                  Belum ada tempat. Tambahkan tempat yang belum ada di peta.
                </p>
                <Link
                  href="/tempat/baru"
                  className="mt-2 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                >
                  Tambah tempat
                </Link>
              </div>
            )}
          </section>

          <section className="mt-10" aria-labelledby="my-posts-title">
            <h2 id="my-posts-title" className="border-b border-line pb-3 font-display text-2xl font-semibold">
              Postingan saya
            </h2>
            {contributions.posts.length > 0 ? (
              <div className="mt-2">
                {contributions.posts.map((post) => (
                  <PostPreview key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-sm text-muted">
                  Belum ada postingan. Bagikan satu info yang kamu ingin temukan sendiri waktu
                  pertama kali sampai di Jakarta.
                </p>
                <Link
                  href="/linimasa"
                  className="mt-2 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                >
                  Buka linimasa
                </Link>
              </div>
            )}
          </section>

          <section className="mt-10" aria-labelledby="my-reviews-title">
            <h2 id="my-reviews-title" className="border-b border-line pb-3 font-display text-2xl font-semibold">
              Ulasan saya
            </h2>
            {contributions.reviews.length > 0 ? (
              <div>
                {contributions.reviews.map((review) => (
                  <article key={review.id} className="border-b border-line py-4">
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
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-sm text-muted">
                  Belum ada ulasan. Ulasan pertama bisa dimulai dari tempat yang paling sering
                  kamu datangi.
                </p>
                <Link
                  href="/jelajah"
                  className="mt-2 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                >
                  Cari tempat
                </Link>
              </div>
            )}
          </section>
        </div>

        <aside aria-label="Pengaturan profil" className="space-y-6">
          <section className="border-t border-line pt-4">
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

          <section className="border-t border-line pt-4">
            <h2 className="font-display text-xl font-semibold">Akun</h2>
            <dl className="mt-3 space-y-2 text-sm">
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
