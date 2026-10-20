"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDefaultCampus } from "@/lib/data/campuses";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { placeSchema, reportSchema, reviewSchema } from "@/lib/validation";
import { safeNumber, safeString, slugify } from "@/lib/utils";

const DEMO_MESSAGE =
  "Mode demo belum menyimpan perubahan. Isi kredensial Supabase di .env.local untuk mengaktifkan database.";

export async function createPlaceAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = placeSchema.safeParse({
    name: safeString(formData.get("name")),
    category_id: safeString(formData.get("category_id")),
    description: safeString(formData.get("description")),
    address: safeString(formData.get("address")),
    latitude: safeNumber(formData.get("latitude")),
    longitude: safeNumber(formData.get("longitude")),
    price_min: safeNumber(formData.get("price_min")) ?? undefined,
    price_max: safeNumber(formData.get("price_max")) ?? undefined,
    price_level: safeNumber(formData.get("price_level")) ?? 2,
    facilities: formData.getAll("facilities").map(String).filter(Boolean),
    open_hours_note: safeString(formData.get("open_hours_note")),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tempat belum lengkap." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menambah tempat." };
  }

  const campus = await getDefaultCampus();
  const supabase = await createClient();

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  const { data: existing } = await supabase
    .from("places")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
  }

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
      created_by: profile.id,
    })
    .select("slug")
    .single();

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/jelajah");
  revalidatePath("/admin");
  redirect(`/tempat/${data.slug}?status=pending`);
}

export async function reviewAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const slug = safeString(formData.get("slug"));
  const parsed = reviewSchema.safeParse({
    place_id: safeString(formData.get("place_id")),
    rating: safeNumber(formData.get("rating")) ?? 0,
    body: safeString(formData.get("body")),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Ulasan belum lengkap." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menulis ulasan." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("place_reviews").upsert(
    {
      place_id: parsed.data.place_id,
      user_id: profile.id,
      rating: parsed.data.rating,
      body: parsed.data.body || null,
    },
    { onConflict: "place_id,user_id" },
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  if (slug) revalidatePath(`/tempat/${slug}`);
  revalidatePath("/jelajah");
  return { ok: true, message: "Ulasan disimpan." };
}

export async function savePlaceAction(placeId: string, shouldSave: boolean): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk menyimpan tempat." };
  }

  const supabase = await createClient();

  if (shouldSave) {
    const { error } = await supabase
      .from("saves")
      .insert({ user_id: profile.id, place_id: placeId });
    if (error && error.code !== "23505") {
      return { ok: false, message: error.message };
    }
  } else {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", profile.id)
      .eq("place_id", placeId);
    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/jelajah");
  revalidatePath("/simpan");
  revalidatePath("/profil");
  return { ok: true, message: shouldSave ? "Tempat disimpan." : "Tempat dilepas dari simpanan." };
}

export async function reportAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = reportSchema.safeParse({
    target_type: safeString(formData.get("target_type")),
    target_id: safeString(formData.get("target_id")),
    reason: safeString(formData.get("reason")),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Laporan belum lengkap." };
  }

  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MESSAGE };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk mengirim laporan." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    reporter_id: profile.id,
    target_type: parsed.data.target_type,
    target_id: parsed.data.target_id,
    reason: parsed.data.reason,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin");
  return { ok: true, message: "Laporan terkirim. Admin akan meninjau." };
}
