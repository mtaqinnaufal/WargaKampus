import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark, Map, Newspaper } from "lucide-react";
import { PostCard } from "@/components/feed/post-card";
import { PlaceGridCard } from "@/components/places/place-grid-card";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonClass } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getSavedPlaces } from "@/lib/data/places";
import { getSavedPosts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Simpanan",
  description: "Tempat dan postingan yang kamu simpan di WargaKampus.",
};

export default async function SavedPage() {
  const current = await requireUser();
  const [places, posts] = await Promise.all([
    getSavedPlaces(current.profile.id),
    getSavedPosts(current.profile.id),
  ]);

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
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Bookmark className="h-4 w-4 text-ink" aria-hidden="true" />
              <span className="font-mono text-[11px] text-muted">Koleksi pribadi</span>
            </div>
            <h1 className="mt-2 max-w-[16ch] font-display text-3xl font-bold leading-[1.02] tracking-[-0.035em] sm:text-4xl">
              Yang kamu simpan.
            </h1>
            <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted">
              Tempat dan cerita yang ingin kamu buka lagi. Simpanan hanya terlihat olehmu.
            </p>

            <dl className="mt-5 flex flex-wrap gap-3">
              <div className="min-w-28 rounded-lg border border-line bg-paper/70 px-4 py-3">
                <dt className="text-[10px] text-muted">Tempat</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                  {places.length}
                </dd>
              </div>
              <div className="min-w-28 rounded-lg border border-line bg-paper/70 px-4 py-3">
                <dt className="text-[10px] text-muted">Postingan</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                  {posts.length}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/jelajah"
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              <Map className="h-4 w-4" aria-hidden="true" />
              Jelajahi tempat
            </Link>
            <Link
              href="/linimasa"
              className={buttonClass({ variant: "primary", size: "md" })}
            >
              <Newspaper className="h-4 w-4" aria-hidden="true" />
              Buka linimasa
            </Link>
          </div>
        </div>
      </header>

      <Reveal>
        <section className="mt-7" aria-labelledby="saved-places-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="saved-places-title" className="font-display text-2xl font-semibold">
                Tempat tersimpan
              </h2>
              <p className="mt-1 text-xs text-muted">
                {places.length} tempat di koleksimu.
              </p>
            </div>
            <Link
              href="/jelajah"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
            >
              Cari lagi
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {places.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {places.map((place) => (
                <PlaceGridCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada tempat tersimpan"
              description="Buka peta, pilih tempat yang berguna, lalu tekan Simpan di halaman tempat."
              action={
                <Link
                  href="/jelajah"
                  className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                >
                  Buka peta
                </Link>
              }
              className="mt-4"
            />
          )}
        </section>
      </Reveal>

      <Reveal delay={80}>
        <section className="mt-10" aria-labelledby="saved-posts-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="saved-posts-title" className="font-display text-2xl font-semibold">
                Cerita tersimpan
              </h2>
              <p className="mt-1 text-xs text-muted">
                {posts.length} cerita di koleksimu.
              </p>
            </div>
            <Link
              href="/linimasa"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink"
            >
              Buka linimasa
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="mt-4 max-w-[760px] space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={current.user?.id ?? null}
                  isDemo={current.isDemo}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada cerita tersimpan"
              description="Di linimasa, tekan Simpan pada cerita yang ingin kamu baca lagi nanti."
              action={
                <Link
                  href="/linimasa"
                  className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                >
                  Buka linimasa
                </Link>
              }
              className="mt-4"
            />
          )}
        </section>
      </Reveal>
    </div>
  );
}
