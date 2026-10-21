"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { POST_CATEGORIES, ROLE_LABELS } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { categoryColor, cn, relativeTime } from "@/lib/utils";

export function LandingFeed({
  posts,
  contributors,
}: {
  posts: Post[];
  contributors: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const onResize = () => updateEdges();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [posts.length, updateEdges]);

  function scrollByCards(direction: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-feed-card]");
    const width = card ? card.offsetWidth + 16 : 416;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
    track.scrollBy({ left: direction * width, behavior });
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
      moved: false,
    };
    setDragging(true);
    track.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 5) dragRef.current.moved = true;
    track.scrollLeft = dragRef.current.scrollLeft - delta;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    dragRef.current.active = false;
    setDragging(false);
    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }
  }

  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  }

  return (
    <section className="relative overflow-hidden border-y border-line bg-[linear-gradient(180deg,var(--color-surface)_0%,var(--color-paper)_100%)]">
      <div
        className="grid-paper pointer-events-none absolute inset-0 opacity-25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid gap-8 py-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-14 lg:py-16">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-live/20 bg-live/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              Linimasa komunitas
            </span>

            <h2 className="mt-5 max-w-[12ch] font-display text-3xl font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-4xl lg:text-[2.9rem]">
              Lagi{" "}
              <span className="relative inline-block">
                <span
                  className="absolute inset-x-0 bottom-1 h-2.5 -rotate-1 bg-signal/75"
                  aria-hidden="true"
                />
                <span className="relative">rame</span>
              </span>{" "}
              di sekitar kampus.
            </h2>

            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-muted">
              Info dari mahasiswa yang baru saja datang. Bukan ulasan bintang lima yang dibuat
              untuk algoritma.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="font-medium text-ink">{posts.length} cerita</span>
              <span className="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true" />
              <span>{contributors} kontributor</span>
            </div>

            <Link
              href="/linimasa"
              className="group mt-6 inline-flex items-center gap-2 rounded-sm border border-ink bg-ink px-4 py-2.5 text-sm font-semibold text-surface transition-colors hover:bg-ink-soft"
            >
              Buka linimasa
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="min-w-0">
          <div>
            {posts.length > 0 ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[10px] text-muted">
                    {posts.length} cerita · geser untuk lihat lainnya
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => scrollByCards(-1)}
                      disabled={edges.start}
                      aria-label="Geser cerita ke kiri"
                      className="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollByCards(1)}
                      disabled={edges.end}
                      aria-label="Geser cerita ke kanan"
                      className="grid h-9 w-9 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div
                  ref={trackRef}
                  role="group"
                  tabIndex={0}
                  aria-label="Daftar cerita, dapat digeser ke kiri dan kanan"
                  onScroll={updateEdges}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onClickCapture={handleClickCapture}
                  style={{ scrollSnapType: dragging ? "none" : undefined }}
                  className={cn(
                    "no-scrollbar mt-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/70",
                    dragging ? "cursor-grabbing select-none" : "cursor-grab",
                  )}
                >
                  {posts.map((post, index) => (
                    <LandingPostCard key={post.id} post={post} lead={index === 0} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-line-strong bg-surface/65 px-6 py-10 text-center text-sm text-muted">
                Belum ada cerita. Jadi yang pertama menulis di linimasa.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LandingPostCard({ post, lead }: { post: Post; lead: boolean }) {
  return (
    <article
      aria-label={`Cerita ${post.author.name}`}
      className={cn(
        "group relative flex w-[286px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgba(11,26,40,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-ink/35 hover:shadow-lift sm:w-[360px] lg:w-[380px]",
        lead &&
          "before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-1 before:bg-signal",
      )}
    >
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar
            name={post.author.name}
            src={post.author.avatar_url}
            size={lead ? "md" : "sm"}
            decorative
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{post.author.name}</p>
            <p className="mt-0.5 text-[10px] text-muted">
              {ROLE_LABELS[post.author.role]} ·{" "}
              <time dateTime={post.created_at} suppressHydrationWarning>
                {relativeTime(post.created_at)}
              </time>
            </p>
          </div>
          <Badge variant="outline" className="shrink-0">
            {POST_CATEGORIES[post.category]}
          </Badge>
        </div>

        <p
          className={cn(
            "prose-kp mt-3 leading-relaxed text-ink-soft",
            lead ? "line-clamp-4 text-[15px]" : "line-clamp-4 text-sm",
          )}
        >
          {post.body}
        </p>

        {post.place ? (
          <Link
            href={`/tempat/${post.place.slug}`}
            className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-paper px-2.5 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: categoryColor(post.place.category.slug) }}
              aria-hidden="true"
            />
            <span className="truncate">{post.place.name}</span>
            <span className="text-muted">·</span>
            <span className="shrink-0 font-mono text-[10px] text-muted">
              {post.place.category.name}
            </span>
          </Link>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
          <div className="flex items-center gap-3 text-[10px] text-muted">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
              {post.like_count}
              <span className="sr-only"> suka</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {post.comment_count}
              <span className="sr-only"> komentar</span>
            </span>
          </div>
          <Link
            href={`/linimasa#post-${post.id}`}
            aria-label={`Baca cerita ${post.author.name}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink"
          >
            Baca
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
