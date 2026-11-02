import { supabase } from "../supabase.js";

export async function getProfile(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,role,campus_id,avatar_url,bio,reputation_points,created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? { ...data, is_active: true } : null;
}

export async function getContributions(userId) {
  const [placesResult, postsResult, reviewsResult] = await Promise.all([
    supabase
      .from("places")
      .select("*, category:place_categories(*)")
      .eq("created_by", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("posts")
      .select(
        "id,user_id,place_id,campus_id,category,body,visibility,status,like_count,comment_count,created_at,author:profiles!posts_user_id_fkey(id,name,avatar_url,role),place:places(id,slug,name,latitude,longitude,category:place_categories(id,name,slug,icon,sort_order)),photos:post_photos(image_url,sort_order),comments(id,post_id,user_id,parent_id,body,created_at,author:profiles!comments_user_id_fkey(id,name,avatar_url,role)),likes:post_likes(user_id)",
      )
      .eq("user_id", userId)
      .eq("status", "published")
      .order("created_at", { ascending: false }),
    supabase
      .from("place_reviews")
      .select(
        "id,place_id,user_id,rating,body,visited_at,created_at,author:profiles!place_reviews_user_id_fkey(id,name,avatar_url,role),place:places(id,slug,name),photos:place_review_photos(image_url,sort_order)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (placesResult.error) throw new Error(placesResult.error.message);
  if (postsResult.error) throw new Error(postsResult.error.message);
  if (reviewsResult.error) throw new Error(reviewsResult.error.message);

  const places = (placesResult.data ?? []).map((row) => ({
    ...row,
    category: Array.isArray(row.category) ? row.category[0] : row.category,
    facilities: row.facilities ?? [],
    open_hours: row.open_hours ?? {},
  }));

  const posts = (postsResult.data ?? []).map((row) => {
    const photos = (row.photos ?? [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((photo) => photo.image_url);
    const comments = (row.comments ?? []).map((comment) => ({
      ...comment,
      author: Array.isArray(comment.author) ? comment.author[0] : comment.author,
    }));
    return {
      ...row,
      author: Array.isArray(row.author) ? row.author[0] : row.author,
      place: Array.isArray(row.place) ? row.place[0] : row.place,
      photos,
      comments,
      liked_by_me: false,
      saved_by_me: false,
    };
  });

  const reviews = (reviewsResult.data ?? []).map((row) => ({
    ...row,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
    place: Array.isArray(row.place) ? row.place[0] : row.place,
    photos: (Array.isArray(row.photos) ? row.photos : [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((photo) => photo.image_url),
  }));

  return { places, posts, reviews };
}
