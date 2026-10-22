"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PostCard } from "@/components/feed/post-card";
import { PostComposer } from "@/components/feed/post-composer";
import { Reveal } from "@/components/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { CAMPUS_CENTER } from "@/lib/constants";
import type { Place, Post } from "@/lib/types";
import { cn, distanceKm } from "@/lib/utils";

type Tab = "terbaru" | "sekitar" | "tersimpan";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "terbaru", label: "Terbaru" },
  { id: "sekitar", label: "Sekitar" },
  { id: "tersimpan", label: "Tersimpan" },
];

export function FeedClient({
  posts,
  places,
  currentUserId,
  isDemo,
  campusName,
}: {
  posts: Post[];
  places: Place[];
  currentUserId?: string | null;
  isDemo: boolean;
  campusName: string;
}) {
  const [tab, setTab] = useState<Tab>("terbaru");

  const filtered = useMemo(() => {
    if (tab === "tersimpan") {
      return posts.filter((post) => post.saved_by_me);
    }

    if (tab === "sekitar") {
      return posts.filter((post) => {
        if (!post.place) return false;
        return (
          distanceKm(
            CAMPUS_CENTER.latitude,
            CAMPUS_CENTER.longitude,
            post.place.latitude,
            post.place.longitude,
          ) <= 2
        );
      });
    }

    return posts;
  }, [posts, tab]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Urutkan linimasa">
          {tabs.map((item) => {
            const count =
              item.id === "tersimpan"
                ? posts.filter((post) => post.saved_by_me).length
                : item.id === "sekitar"
                  ? posts.filter((post) => {
                      if (!post.place) return false;
                      return (
                        distanceKm(
                          CAMPUS_CENTER.latitude,
                          CAMPUS_CENTER.longitude,
                          post.place.latitude,
                          post.place.longitude,
                        ) <= 2
                      );
                    }).length
                  : posts.length;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={tab === item.id}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
                  tab === item.id
                    ? "bg-ink text-surface"
                    : "text-muted hover:bg-paper-deep hover:text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    tab === item.id ? "text-surface/70" : "text-muted",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[10px] text-muted">{campusName}</span>
      </div>

      {!currentUserId ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
          <p className="max-w-[56ch] leading-relaxed text-muted">
            Semua cerita bisa dibaca tanpa login. Masuk untuk like, komentar, dan menyimpan.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/masuk?next=/linimasa"
              className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
            >
              Masuk
            </Link>
            <Link href="/daftar" className="text-muted hover:text-ink">
              Daftar
            </Link>
          </div>
        </div>
      ) : null}

      {currentUserId ? (
        <div className="mt-5 rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
          <PostComposer places={places} isDemo={isDemo} />
        </div>
      ) : (
        <section className="mt-5 rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(11,26,40,0.04)]">
          <h2 className="font-display text-xl font-semibold">Bagi pengalaman</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Masuk untuk membuat postingan, berkomentar, dan menyimpan cerita.
          </p>
          <Link
            href="/masuk?next=/linimasa"
            className="mt-3 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
          >
            Masuk untuk menulis
          </Link>
        </section>
      )}

      {filtered.length > 0 ? (
        <div className="mt-5 space-y-4">
          {filtered.map((post, index) => (
            <Reveal key={post.id} delay={Math.min(index, 6) * 50}>
              <PostCard
                post={post}
                currentUserId={currentUserId}
                isDemo={isDemo}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="py-8">
          <EmptyState
            title={
              tab === "tersimpan"
                ? "Belum ada yang disimpan"
                : tab === "sekitar"
                  ? "Belum ada cerita dekat kampus"
                  : "Linimasa masih kosong"
            }
            description={
              tab === "tersimpan"
                ? "Tekan tombol Simpan pada postingan atau tempat yang ingin kamu buka lagi nanti."
                : "Jadi yang pertama menulis pengalaman. Sebut nama tempat dan hal yang paling berguna untuk anak kos lain."
            }
            action={
              <Link
                href="/jelajah"
                className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
              >
                Cari tempat dulu
              </Link>
            }
          />
        </div>
      )}
    </div>
  );
}
