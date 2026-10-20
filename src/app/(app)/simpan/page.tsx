import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { PostCard } from "@/components/feed/post-card";
import { PlaceTile } from "@/components/places/place-tile";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/lib/auth";
import { getSavedPlaces } from "@/lib/data/places";
import { getSavedPosts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Simpanan",
  description: "Tempat dan postingan yang kamu simpan di KosPintar.",
};

export default async function SavedPage() {
  const current = await requireUser();
  const [places, posts] = await Promise.all([
    getSavedPlaces(current.profile.id),
    getSavedPosts(current.profile.id),
  ]);

  return (
    <div className="container-page py-6 lg:py-8">
      <header className="border-b border-line pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <Bookmark className="h-4 w-4 text-ink" aria-hidden="true" />
          <span className="font-mono text-[11px] text-muted">Koleksi pribadi</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">
          Yang kamu simpan.
        </h1>
        <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted">
          Tempat dan cerita yang ingin kamu buka lagi. Simpanan hanya terlihat olehmu.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="saved-places-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 id="saved-places-title" className="font-display text-2xl font-semibold">
            Tempat
          </h2>
          <span className="font-mono text-[11px] text-muted">{places.length} tempat</span>
        </div>

        {places.length > 0 ? (
          <div className="mt-4 grid gap-x-8 md:grid-cols-2">
            {places.map((place, index) => (
              <PlaceTile
                key={place.id}
                place={place}
                featured={index === 0}
                className={index === 0 ? "md:col-span-2" : undefined}
              />
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
            className="mt-5"
          />
        )}
      </section>

      <section className="mt-12" aria-labelledby="saved-posts-title">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 id="saved-posts-title" className="font-display text-2xl font-semibold">
            Postingan
          </h2>
          <span className="font-mono text-[11px] text-muted">{posts.length} postingan</span>
        </div>

        {posts.length > 0 ? (
          <div className="max-w-[760px]">
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
            title="Belum ada postingan tersimpan"
            description="Di linimasa, tekan Simpan pada cerita yang ingin kamu baca lagi nanti."
            action={
              <Link
                href="/linimasa"
                className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
              >
                Buka linimasa
              </Link>
            }
            className="mt-5"
          />
        )}
      </section>
    </div>
  );
}
