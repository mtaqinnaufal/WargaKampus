import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { POST_CATEGORIES } from "@/lib/constants";
import type { Post } from "@/lib/types";
import { categoryColor, cn, relativeTime } from "@/lib/utils";

export function PostPreview({ post, lead = false }: { post: Post; lead?: boolean }) {
  return (
    <article className={cn("relative border-l border-line pl-5", lead ? "pb-8" : "py-5")}>
      <span
        className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-paper bg-signal"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
        <span className="font-medium text-ink">{post.author.name}</span>
        <span>·</span>
        <time dateTime={post.created_at} suppressHydrationWarning>
          {relativeTime(post.created_at)}
        </time>
        <Badge variant="outline">{POST_CATEGORIES[post.category]}</Badge>
      </div>

      <p
        className={cn(
          "prose-kp mt-2 leading-relaxed text-ink-soft",
          lead ? "line-clamp-5 text-[15px]" : "line-clamp-4 text-sm",
        )}
      >
        {post.body}
      </p>

      {post.place ? (
        <Link
          href={`/tempat/${post.place.slug}`}
          className="mt-3 inline-flex max-w-full items-center gap-2 text-xs text-ink-soft hover:underline"
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: categoryColor(post.place.category.slug) }}
            aria-hidden="true"
          />
          <span className="truncate">{post.place.name}</span>
          <span className="text-muted">·</span>
          <span className="font-mono text-[10px] text-muted">{post.place.category.name}</span>
        </Link>
      ) : null}

      {lead && post.photos[0] ? (
        <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-sm border border-line bg-paper-deep">
          <Image
            src={post.photos[0]}
            alt={`Foto unggahan ${post.author.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      ) : null}

      <Link
        href={`/linimasa#post-${post.id}`}
        className="mt-3 inline-flex text-xs font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2"
      >
        Baca di linimasa
      </Link>
    </article>
  );
}
