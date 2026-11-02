// Place actions ported from src/app/actions/places.ts.
import { supabase } from "../supabase.js";
import { getCurrentUser } from "../auth.js";
import { getDefaultCampus } from "../api/campuses.js";
import { slugify } from "../utils.js";
import { validatePlace, validateReport, validateReview } from "../validation.js";

export async function createPlace(input) {
  const parsed = validatePlace(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menambah tempat." };
  }

  const campus = await getDefaultCampus();
  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  const { data: existing } = await supabase
    .from("places")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

  const { data, error } = await supabase
    .from("places")
    .insert({
      campus_id: campus.id,
      category_id: parsed.data.category_id,
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
      address: parsed.data.address || null,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      price_min: parsed.data.price_min ?? null,
      price_max: parsed.data.price_max ?? null,
      price_level: parsed.data.price_level,
      open_hours: parsed.data.open_hours_note
        ? { note: parsed.data.open_hours_note }
        : { note: "Jam buka belum diverifikasi" },
      facilities: parsed.data.facilities,
      status: "pending",
      source: "user",
      created_by: current.profile.id,
    })
    .select("id,slug")
    .single();

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Tempat berhasil dikirim untuk verifikasi.", placeId: data.id, slug: data.slug };
}

export async function review(input) {
  const parsed = validateReview(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menulis ulasan." };
  }

  const { data, error } = await supabase
    .from("place_reviews")
    .upsert(
      {
        place_id: parsed.data.place_id,
        user_id: current.profile.id,
        rating: parsed.data.rating,
        body: parsed.data.body || null,
      },
      { onConflict: "place_id,user_id" },
    )
    .select("id")
    .single();

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Ulasan disimpan.", reviewId: data.id };
}

export async function savePlace(placeId, shouldSave) {
  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menyimpan tempat." };
  }
  const userId = current.profile.id;

  if (shouldSave) {
    const { error } = await supabase.from("saves").insert({ user_id: userId, place_id: placeId });
    if (error && error.code !== "23505") return { ok: false, message: error.message };
  } else {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", userId)
      .eq("place_id", placeId);
    if (error) return { ok: false, message: error.message };
  }
  return { ok: true, message: shouldSave ? "Tempat disimpan." : "Tempat dilepas dari simpanan." };
}

export async function report(input) {
  const parsed = validateReport(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk mengirim laporan." };
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: current.profile.id,
    target_type: parsed.data.target_type,
    target_id: parsed.data.target_id,
    reason: parsed.data.reason,
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Laporan terkirim. Admin akan meninjau." };
}
