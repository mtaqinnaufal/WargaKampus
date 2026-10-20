"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { postSchema } from "@/lib/validation";
import { safeString } from "@/lib/utils";

const DEMO_MESSAGE =
  "Mode demo belum menyimpan perubahan. Isi kredensial Supabase di .env.local untuk mengaktifkan database.";

export async function createPostAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = postSchema.safeParse({
    body: safeString(formData.get("body")),
    category: safeString(formData.get("category")),
    place_id: safeString(formData.get("place_id")) || undefined,
    visibility: safeString(formData.get("visibility")) || "campus",
    photo_url: safeString(formData.get("photo_url")),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Postingan belum lengkap." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk membuat postingan." };
  }

  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: profile.id,
      place_id: parsed.data.place_id || null,
      campus_id: profile.campus_id,
      category: parsed.data.category,
      body: parsed.data.body,
      visibility: parsed.data.visibility,
    })
    .select("id")
    .single();

  if (error) return { ok: false, message: error.message };

  if (parsed.data.photo_url) {
    await supabase.from("post_photos").insert({
      post_id: post.id,
      image_url: parsed.data.photo_url,
      sort_order: 0,
    });
  }

  revalidatePath("/linimasa");
  revalidatePath("/");
  return { ok: true, message: "Postingan dibuat." };
}

export async function toggleLikeAction(postId: string, like: boolean): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk memberi like." };
  }

  const supabase = await createClient();

  if (like) {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: profile.id });
    if (error && error.code !== "23505") return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", profile.id);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/linimasa");
  return { ok: true };
}

export async function addCommentAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const postId = safeString(formData.get("post_id"));
  const body = safeString(formData.get("body"));

  if (!postId || body.length < 2) {
    return { ok: false, message: "Tulis komentar minimal 2 karakter." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk berkomentar." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: profile.id,
    body,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/linimasa");
  return { ok: true, message: "Komentar ditambahkan." };
}

export async function savePostAction(postId: string, shouldSave: boolean): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menyimpan postingan." };
  }

  const supabase = await createClient();

  if (shouldSave) {
    const { error } = await supabase
      .from("saves")
      .insert({ user_id: profile.id, post_id: postId });
    if (error && error.code !== "23505") return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", profile.id)
      .eq("post_id", postId);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/linimasa");
  revalidatePath("/simpan");
  revalidatePath("/profil");
  return { ok: true, message: shouldSave ? "Postingan disimpan." : "Postingan dilepas." };
}
