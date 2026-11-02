import { supabase } from "../supabase.js";
import { assetUrl } from "../utils.js";

const POST_SELECT =
  "id,user_id,place_id,campus_id,category,body,visibility,status,like_count,comment_count,created_at,author:profiles!posts_user_id_fkey(id,name,avatar_url,role),place:places(id,slug,name,latitude,longitude,category:place_categories(id,name,slug,icon,sort_order)),photos:post_photos(image_url,sort_order),comments(id,post_id,user_id,parent_id,body,created_at,author:profiles!comments_user_id_fkey(id,name,avatar_url,role)),likes:post_likes(user_id)";

function normalizePost(row, userId, savedIds) {
  const likes = Array.isArray(row.likes) ? row.likes : [];
  const comments = (Array.isArray(row.comments) ? row.comments : [])
    .map((comment) => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      parent_id: comment.parent_id,
      body: comment.body,
      created_at: comment.created_at,
      author: Array.isArray(comment.author) ? comment.author[0] : comment.author,
    }))
    .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));

  const photos = (Array.isArray(row.photos) ? row.photos : [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((photo) => assetUrl(photo.image_url));

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
    liked_by_me: Boolean(userId && likes.some((like) => like.user_id === userId)),
    saved_by_me: Boolean(row.id && savedIds?.has(row.id)),
  };
}

export async function getPosts(options) {
  const { campusId, userId = null, limit = 30 } = options ?? {};
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);

  const savedIds = new Set();
  if (userId) {
    const { data: saves } = await supabase
      .from("saves")
      .select("post_id")
      .eq("user_id", userId)
      .not("post_id", "is", null);
    (saves ?? []).forEach((save) => save.post_id && savedIds.add(save.post_id));
  }

  return (data ?? []).map((row) => normalizePost(row, userId, savedIds));
}

export async function getSavedPosts(userId) {
  const { data, error } = await supabase
    .from("saves")
    .select(`post_id,post:posts(${POST_SELECT})`)
    .eq("user_id", userId)
    .not("post_id", "is", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row) => {
      const post = Array.isArray(row.post) ? row.post[0] : row.post;
      return post ? normalizePost(post, userId, new Set([post.id])) : null;
    })
    .filter(Boolean);
}
