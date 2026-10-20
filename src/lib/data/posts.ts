import { MOCK_POSTS, MOCK_SAVED_POSTS } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function normalizePost(row: any, userId?: string | null, savedIds?: Set<string>): Post {
  const likes = Array.isArray(row.likes) ? row.likes : [];
  const comments = (Array.isArray(row.comments) ? row.comments : [])
    .map((comment: any) => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      parent_id: comment.parent_id,
      body: comment.body,
      created_at: comment.created_at,
      author: Array.isArray(comment.author) ? comment.author[0] : comment.author,
    }))
    .sort((a: any, b: any) => String(a.created_at).localeCompare(String(b.created_at)));

  const photos = (Array.isArray(row.photos) ? row.photos : [])
    .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((photo: any) => photo.image_url);

  const place = Array.isArray(row.place) ? row.place[0] : row.place;

  return {
    id: row.id,
    user_id: row.user_id,
    place_id: row.place_id,
    campus_id: row.campus_id,
    category: row.category,
    body: row.body,
    visibility: row.visibility,
    status: row.status,
    like_count: Number(row.like_count ?? 0),
    comment_count: Number(row.comment_count ?? comments.length),
    created_at: row.created_at,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
    place: place
      ? {
          id: place.id,
          slug: place.slug,
          name: place.name,
          latitude: Number(place.latitude),
          longitude: Number(place.longitude),
          category: Array.isArray(place.category) ? place.category[0] : place.category,
        }
      : null,
    photos,
    comments,
    liked_by_me: Boolean(userId && likes.some((like: any) => like.user_id === userId)),
    saved_by_me: Boolean(row.id && savedIds?.has(row.id)),
  };
}

export async function getPosts(options: { campusId: string; userId?: string | null; limit?: number }) {
  if (!isSupabaseConfigured) {
    return MOCK_POSTS;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id,user_id,place_id,campus_id,category,body,visibility,status,like_count,comment_count,created_at,author:profiles!posts_user_id_fkey(id,name,avatar_url,role),place:places(id,slug,name,latitude,longitude,category:place_categories(id,name,slug,icon,sort_order)),photos:post_photos(image_url,sort_order),comments(id,post_id,user_id,parent_id,body,created_at,author:profiles!comments_user_id_fkey(id,name,avatar_url,role)),likes:post_likes(user_id)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(options.limit ?? 30);

  if (error) throw new Error(error.message);

  const savedIds = new Set<string>();
  if (options.userId) {
    const { data: saves } = await supabase
      .from("saves")
      .select("post_id")
      .eq("user_id", options.userId)
      .not("post_id", "is", null);
    (saves ?? []).forEach((save: any) => save.post_id && savedIds.add(save.post_id));
  }

  const visible = (data ?? []).filter(
    (post: any) =>
      post.visibility === "public" ||
      post.campus_id === options.campusId ||
      post.user_id === options.userId,
  );

  return visible.map((row: any) => normalizePost(row, options.userId, savedIds));
}

export async function getSavedPosts(userId: string) {
  if (!isSupabaseConfigured) {
    return MOCK_SAVED_POSTS;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saves")
    .select(
      "post_id,post:posts(id,user_id,place_id,campus_id,category,body,visibility,status,like_count,comment_count,created_at,author:profiles!posts_user_id_fkey(id,name,avatar_url,role),place:places(id,slug,name,latitude,longitude,category:place_categories(id,name,slug,icon,sort_order)),photos:post_photos(image_url,sort_order),comments(id,post_id,user_id,parent_id,body,created_at,author:profiles!comments_user_id_fkey(id,name,avatar_url,role)),likes:post_likes(user_id))",
    )
    .eq("user_id", userId)
    .not("post_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row: any) => {
      const post = Array.isArray(row.post) ? row.post[0] : row.post;
      return post ? normalizePost(post, userId, new Set([post.id])) : null;
    })
    .filter(Boolean) as Post[];
}
