import { MOCK_CAMPUS } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Campus } from "@/lib/types";

export async function getCampuses(): Promise<Campus[]> {
  if (!isSupabaseConfigured) return [MOCK_CAMPUS];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campuses")
    .select("id,name,slug,city,latitude,longitude,radius_km")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Campus[];
}

export async function getDefaultCampus(): Promise<Campus> {
  if (!isSupabaseConfigured) return MOCK_CAMPUS;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campuses")
    .select("id,name,slug,city,latitude,longitude,radius_km")
    .order("name", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Campus | null) ?? MOCK_CAMPUS;
}

export async function getCampusBySlug(slug: string): Promise<Campus | null> {
  if (!isSupabaseConfigured) return slug === MOCK_CAMPUS.slug ? MOCK_CAMPUS : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campuses")
    .select("id,name,slug,city,latitude,longitude,radius_km")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Campus | null) ?? null;
}
