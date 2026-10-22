"use client";

import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type Caption = "banner" | "pricelist" | "foto";

export type PlaceMediaFiles = {
  banner?: File | null;
  pricelist?: File | null;
  photos?: File[];
};

async function uploadOne(
  supabase: ReturnType<typeof createClient>,
  file: File,
  placeId: string,
  userId: string,
  caption: Caption,
) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, WebP, atau GIF.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Ukuran setiap gambar maksimal 5 MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${placeId}/${crypto.randomUUID()}-${caption}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("place-photos").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("place-photos").getPublicUrl(path);
  const { error: insertError } = await supabase.from("place_photos").insert({
    place_id: placeId,
    user_id: userId,
    image_url: data.publicUrl,
    caption,
  });
  if (insertError) throw new Error(insertError.message);
}

export async function uploadPlaceMediaClient(placeId: string, files: PlaceMediaFiles) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Sesi login tidak ditemukan. Silakan masuk ulang.");
  }

  if (files.banner) {
    await uploadOne(supabase, files.banner, placeId, user.id, "banner");
  }
  if (files.pricelist) {
    await uploadOne(supabase, files.pricelist, placeId, user.id, "pricelist");
  }
  for (const photo of files.photos ?? []) {
    await uploadOne(supabase, photo, placeId, user.id, "foto");
  }
}
