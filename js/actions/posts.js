// Post actions ported from src/app/actions/posts.ts.
import { supabase } from "../supabase.js";
import { getCurrentUser } from "../auth.js";
import { validatePost } from "../validation.js";

export async function createPost(input) {
  const parsed = validatePost(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk membuat postingan." };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: current.profile.id,
      place_id: parsed.data.place_id || null,
      campus_id: current.profile.campus_id,
      category: parsed.data.category,
      body: parsed.data.body,
      visibility: "public",
    })
    .select("id")
    .single();

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Postingan dibuat.", postId: data.id };
}

export async function toggleLike(postId, like) {
  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk memberi like." };
  }
  const userId = current.profile.id;

  if (like) {
    const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
    if (error && error.code !== "23505") return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) return { ok: false, message: error.message };
  }
  return { ok: true };
}

export async function addComment(postId, body) {
  const text = String(body ?? "").trim();
  if (!postId || text.length < 2) {
    return { ok: false, message: "Tulis komentar minimal 2 karakter." };
  }
  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk berkomentar." };
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: current.profile.id,
      body: text,
    })
    .select("id,post_id,user_id,body,created_at")
    .single();
  if (error) return { ok: false, message: error.message };
  return {
    ok: true,
    message: "Komentar ditambahkan.",
    comment: {
      ...comment,
      author: {
        id: current.profile.id,
        name: current.profile.name,
        avatar_url: current.profile.avatar_url,
        role: current.profile.role,
      },
    },
  };
}

export async function savePost(postId, shouldSave) {
  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menyimpan postingan." };
  }
  const userId = current.profile.id;

  if (shouldSave) {
    const { error } = await supabase.from("saves").insert({ user_id: userId, post_id: postId });
    if (error && error.code !== "23505") return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);
    if (error) return { ok: false, message: error.message };
  }
  return { ok: true, message: shouldSave ? "Postingan disimpan." : "Postingan dilepas." };
}
