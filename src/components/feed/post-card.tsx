"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import {
  Bookmark,
  Heart,
  Link2,
  MessageCircle,
  Send,
} from "lucide-react";
import { addCommentAction, savePostAction, toggleLikeAction } from "@/app/actions/posts";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FormMessage } from "@/components/ui/form-message";
import { Textarea } from "@/components/ui/input";
import { POST_CATEGORIES, ROLE_LABELS } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { categoryColor, cn, relativeTime } from "@/lib/utils";

function PostPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="grid aspect-[16/9] place-items-center rounded-sm border border-line bg-paper-deep text-sm text-muted">
        Foto tidak dapat dimuat
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-sm border border-line bg-paper-deep">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 680px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function PostCard({
  post,
  currentUserId,
  isDemo,
  compact = false,
}: {
  post: Post;
  currentUserId?: string | null;
  isDemo?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [saved, setSaved] = useState(post.saved_by_me);
  const [showComments, setShowComments] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [commentState, commentAction, commentPending] = useActionState(
    addCommentAction,
    null,
  );
  const commentFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (commentState?.ok) {
      commentFormRef.current?.reset();
      setMessage(commentState.message ?? "Komentar ditambahkan.");
      router.refresh();
    } else if (commentState?.message) {
      setMessage(commentState.message);
    }
  }, [commentState, router]);

  function handleLike() {
    if (!currentUserId) {
      router.push("/masuk?next=/linimasa");
      return;
    }

    const next = !liked;
    setLiked(next);
    setLikeCount((count) => Math.max(0, count + (next ? 1 : -1)));
    setMessage(null);

    startTransition(async () => {
      const result = await toggleLikeAction(post.id, next);
      if (!result.ok) {
        setLiked(!next);
        setLikeCount((count) => Math.max(0, count + (next ? -1 : 1)));
        setMessage(result.message ?? "Like belum tersimpan.");
      }
    });
  }

  function handleSave() {
    if (!currentUserId) {
      router.push("/masuk?next=/linimasa");
      return;
    }

    const next = !saved;
    setSaved(next);
    setMessage(null);

    startTransition(async () => {
      const result = await savePostAction(post.id, next);
      if (!result.ok) {
        setSaved(!next);
        setMessage(result.message ?? "Simpanan belum tersimpan.");
      }
    });
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/linimasa#post-${post.id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const commentsToShow = showComments ? post.comments : post.comments.slice(-2);

  return (
    <article id={`post-${post.id}`} className="border-b border-line py-6 sm:py-8">
      <div className="flex gap-4">
        <div className="hidden w-10 shrink-0 flex-col items-center sm:flex">
          <Avatar name={post.author.name} src={post.author.avatar_url} size="md" decorative />
          <span className="mt-3 w-px flex-1 bg-line" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <header className="flex items-start gap-3">
            <div className="sm:hidden">
              <Avatar name={post.author.name} src={post.author.avatar_url} size="sm" decorative />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium text-ink">{post.author.name}</span>
                <span className="text-xs text-muted">{ROLE_LABELS[post.author.role]}</span>
                <span className="text-xs text-muted">·</span>
                <time dateTime={post.created_at} className="text-xs text-muted" suppressHydrationWarning>
                  {relativeTime(post.created_at)}
                </time>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{POST_CATEGORIES[post.category]}</Badge>
                {isDemo ? <Badge variant="signal">Data demo</Badge> : null}
              </div>
            </div>
          </header>

          <p className={cn("prose-kp mt-3 text-[15px] text-ink-soft", compact && "line-clamp-5")}>
            {post.body}
          </p>

          {post.place ? (
            <Link
              href={`/tempat/${post.place.slug}`}
              className="mt-3 inline-flex max-w-full items-center gap-2 rounded-sm border border-line bg-surface px-2.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: categoryColor(post.place.category.slug) }}
                aria-hidden="true"
              />
              <span className="truncate">{post.place.name}</span>
              <span className="text-muted">·</span>
              <span className="font-mono text-[10px] text-muted">
                {post.place.category.name}
              </span>
            </Link>
          ) : null}

          {post.photos.length > 0 ? (
            <div className={cn("mt-4 grid gap-2", post.photos.length > 1 && "sm:grid-cols-2")}>
              {post.photos.map((photo, index) => (
                <PostPhoto
                  key={photo}
                  src={photo}
                  alt={`Foto unggahan ${post.author.name}${index > 0 ? `, foto ${index + 1}` : ""}`}
                />
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              aria-pressed={liked}
              aria-label={liked ? "Batalkan suka" : "Suka postingan"}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 text-xs transition-colors hover:bg-paper-deep",
                liked ? "text-live" : "text-muted",
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} aria-hidden="true" />
              {likeCount}
            </button>

            <button
              type="button"
              onClick={() => setShowComments((value) => !value)}
              aria-expanded={showComments}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 text-xs text-muted transition-colors hover:bg-paper-deep"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {post.comment_count}
            </button>

            <button
              type="button"
              onClick={handleSave}
              aria-pressed={saved}
              aria-label={saved ? "Batalkan simpan" : "Simpan postingan"}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 text-xs transition-colors hover:bg-paper-deep",
                saved ? "text-ink" : "text-muted",
              )}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
              {saved ? "Tersimpan" : "Simpan"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2.5 text-xs text-muted transition-colors hover:bg-paper-deep"
            >
              <Link2 className="h-4 w-4" aria-hidden="true" />
              {copied ? "Tautan disalin" : "Bagikan"}
            </button>

            {isPending ? (
              <span className="font-mono text-[10px] text-muted" role="status">
                Menyimpan...
              </span>
            ) : null}
          </div>

          {message ? <FormMessage message={message} className="mt-3" /> : null}

          {post.comments.length > 0 ? (
            <div className="mt-4 border-t border-line pt-3">
              {!showComments && post.comments.length > 2 ? (
                <button
                  type="button"
                  onClick={() => setShowComments(true)}
                  className="text-xs font-medium text-ink underline underline-offset-2"
                >
                  Lihat {post.comments.length} komentar
                </button>
              ) : null}

              {commentsToShow.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 py-2">
                  <Avatar
                    name={comment.author.name}
                    src={comment.author.avatar_url}
                    size="xs"
                    decorative
                  />
                  <div className="min-w-0">
                    <p className="text-xs">
                      <span className="font-medium text-ink">{comment.author.name}</span>{" "}
                      <time dateTime={comment.created_at} className="text-muted" suppressHydrationWarning>
                        {relativeTime(comment.created_at)}
                      </time>
                    </p>
                    <p className="prose-kp mt-0.5 text-sm text-ink-soft">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {currentUserId ? (
            <form ref={commentFormRef} action={commentAction} className="mt-4 flex items-end gap-2">
              <input type="hidden" name="post_id" value={post.id} />
              <label htmlFor={`comment-${post.id}`} className="sr-only">
                Tulis komentar
              </label>
              <Textarea
                id={`comment-${post.id}`}
                name="body"
                rows={1}
                placeholder="Tulis komentar"
                className="min-h-10 py-2"
                required
              />
              <button
                type="submit"
                disabled={commentPending}
                aria-label="Kirim komentar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-ink bg-signal text-ink disabled:opacity-50"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          ) : (
            <p className="mt-4 text-xs text-muted">
              <Link
                href="/masuk?next=/linimasa"
                className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2"
              >
                Masuk
              </Link>{" "}
              untuk berkomentar.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
