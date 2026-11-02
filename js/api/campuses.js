import { supabase } from "../supabase.js";

const CAMPUS_FIELDS = "id,name,slug,city,latitude,longitude,radius_km";

export async function getCampuses() {
  const { data, error } = await supabase
    .from("campuses")
    .select(CAMPUS_FIELDS)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDefaultCampus() {
  const { data, error } = await supabase
    .from("campuses")
    .select(CAMPUS_FIELDS)
    .order("name", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function getCampusBySlug(slug) {
  const { data, error } = await supabase
    .from("campuses")
    .select(CAMPUS_FIELDS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}
