"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

type StorageBucket = "place-photos" | "post-photos" | "review-photos" | "avatars";
type SupabaseClient = ReturnType<typeof createClient>;

export type PlaceMediaFiles = {
  banner?: File | null;
  pricelist?: File | null;
  photos?: File[];
};

function assertValidImage(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, WebP, atau GIF.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Ukuran setiap gambar maksimal 5 MB.");
  }
}

function extensionFor(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXTENSIONS.has(ext)) return ext;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

async function requireUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Sesi login tidak ditemukan. Silakan masuk ulang.");
  }
  return user;
}

async function uploadImage(
  supabase: SupabaseClient,
  bucket: StorageBucket,
  path: string,
  file: File,
) {
  assertValidImage(file);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadPlaceMedia(placeId: string, files: PlaceMediaFiles) {
  const supabase = createClient();
  const user = await requireUser(supabase);

  async function uploadOne(file: File, caption: "banner" | "pricelist" | "foto") {
    const path = `${user.id}/${placeId}/${crypto.randomUUID()}-${caption}.${extensionFor(file)}`;
    const imageUrl = await uploadImage(supabase, "place-photos", path, file);

    const { error } = await supabase.from("place_photos").insert({
      place_id: placeId,
      user_id: user.id,
      image_url: imageUrl,
      caption,
    });
    if (error) throw new Error(error.message);
  }

  if (files.banner) await uploadOne(files.banner, "banner");
  if (files.pricelist) await uploadOne(files.pricelist, "pricelist");
  for (const photo of files.photos ?? []) {
    await uploadOne(photo, "foto");
  }
}

export async function uploadPostPhotos(postId: string, files: File[]) {
  if (files.length === 0) return [];

  const supabase = createClient();
  const user = await requireUser(supabase);
  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const path = `${user.id}/${postId}/${crypto.randomUUID()}.${extensionFor(file)}`;
    const imageUrl = await uploadImage(supabase, "post-photos", path, file);

    const { error } = await supabase.from("post_photos").insert({
      post_id: postId,
      image_url: imageUrl,
      sort_order: index,
    });
    if (error) throw new Error(error.message);

    urls.push(imageUrl);
  }

  return urls;
}

export async function uploadReviewPhotos(reviewId: string, files: File[]) {
  if (files.length === 0) return [];

  const supabase = createClient();
  const user = await requireUser(supabase);
  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const path = `${user.id}/${reviewId}/${crypto.randomUUID()}.${extensionFor(file)}`;
    const imageUrl = await uploadImage(supabase, "review-photos", path, file);

    const { error } = await supabase.from("place_review_photos").insert({
      review_id: reviewId,
      user_id: user.id,
      image_url: imageUrl,
      sort_order: index,
    });
    if (error) throw new Error(error.message);

    urls.push(imageUrl);
  }

  return urls;
}

export async function uploadAvatar(file: File) {
  const supabase = createClient();
  const user = await requireUser(supabase);

  const path = `${user.id}/avatar-${crypto.randomUUID()}.${extensionFor(file)}`;
  const imageUrl = await uploadImage(supabase, "avatars", path, file);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: imageUrl })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  return imageUrl;
}
