import {
  MOCK_CATEGORIES,
  MOCK_PLACES,
  MOCK_REVIEWS,
  MOCK_SAVED_PLACES,
} from "@/lib/mock-data";
import { CAMPUS_CENTER } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Category, Place, PlacePhoto, Review } from "@/lib/types";
import { distanceKm } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

function normalizeCategory(value: any): Category {
  const category = Array.isArray(value) ? value[0] : value;
  return {
    id: category?.id ?? "unknown",
    name: category?.name ?? "Lainnya",
    slug: category?.slug ?? "lainnya",
    icon: category?.icon ?? "map-pin",
    sort_order: category?.sort_order ?? 99,
  };
}

function normalizePlace(row: any, saved = false): Place {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: normalizeCategory(row.category),
    description: row.description ?? "",
    address: row.address ?? "",
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    distance_km: distanceKm(
      CAMPUS_CENTER.latitude,
      CAMPUS_CENTER.longitude,
      Number(row.latitude),
      Number(row.longitude),
    ),
    price_min: row.price_min === null ? null : Number(row.price_min),
    price_max: row.price_max === null ? null : Number(row.price_max),
    price_level: Number(row.price_level ?? 2),
    open_hours: row.open_hours ?? {},
    facilities: row.facilities ?? [],
    status: row.status,
    source: row.source ?? "user",
    osm_id: row.osm_id ?? null,
    rating_avg: Number(row.rating_avg ?? 0),
    review_count: Number(row.review_count ?? 0),
    created_by: row.created_by ?? null,
    owner_id: row.owner_id ?? null,
    campus_id: row.campus_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    saved_by_me: saved || Boolean(row.saved_by_me),
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return MOCK_CATEGORIES;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("place_categories")
    .select("id,name,slug,icon,sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getPlaces(options?: { includePending?: boolean; userId?: string }) {
  const includePending = options?.includePending ?? false;

  if (!isSupabaseConfigured) {
    return MOCK_PLACES;
  }

  const supabase = await createClient();
  let query = supabase
    .from("places")
    .select("*, category:place_categories(*)")
    .order("rating_avg", { ascending: false })
    .order("review_count", { ascending: false });

  if (!includePending) {
    query = query.eq("status", "verified");
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => normalizePlace(row));
}

export async function getFeaturedPlaces(limit = 6) {
  const places = await getPlaces();
  return [...places]
    .sort((a, b) => b.rating_avg - a.rating_avg || b.review_count - a.review_count)
    .slice(0, limit);
}

export async function getPlaceBySlug(slug: string) {
  if (!isSupabaseConfigured) {
    return MOCK_PLACES.find((place) => place.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("*, category:place_categories(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? normalizePlace(data) : null;
}

export async function getPlacePhotos(placeId: string): Promise<PlacePhoto[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("place_photos")
    .select("id,place_id,user_id,image_url,caption,created_at")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as PlacePhoto[];
}

export async function getPlaceReviews(placeId: string): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    return MOCK_REVIEWS.filter((review) => review.place_id === placeId);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("place_reviews")
    .select(
      "id,place_id,user_id,rating,body,visited_at,created_at,author:profiles!place_reviews_user_id_fkey(id,name,avatar_url,role)",
    )
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    place_id: row.place_id,
    user_id: row.user_id,
    rating: row.rating,
    body: row.body,
    visited_at: row.visited_at,
    created_at: row.created_at,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
  }));
}

export async function getSavedPlaces(userId: string) {
  if (!isSupabaseConfigured) {
    return MOCK_SAVED_PLACES;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saves")
    .select("place_id,place:places(*,category:place_categories(*))")
    .eq("user_id", userId)
    .not("place_id", "is", null);

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row: any) => {
      const place = Array.isArray(row.place) ? row.place[0] : row.place;
      return place ? normalizePlace(place, true) : null;
    })
    .filter(Boolean) as Place[];
}

export async function isPlaceSaved(userId: string, placeId: string) {
  if (!isSupabaseConfigured) {
    return MOCK_SAVED_PLACES.some((place) => place.id === placeId);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", userId)
    .eq("place_id", placeId)
    .maybeSingle();

  return Boolean(data);
}
