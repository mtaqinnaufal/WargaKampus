import { supabase } from "../supabase.js";
import { CAMPUS_CENTER } from "../config.js";
import { assetUrl, distanceKm } from "../utils.js";

function normalizeCategory(value) {
  const category = Array.isArray(value) ? value[0] : value;
  return {
    id: category?.id ?? "unknown",
    name: category?.name ?? "Lainnya",
    slug: category?.slug ?? "lainnya",
    icon: category?.icon ?? "map-pin",
    sort_order: category?.sort_order ?? 99,
  };
}

export function normalizePlace(row, saved = false) {
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

export async function getCategories() {
  const { data, error } = await supabase
    .from("place_categories")
    .select("id,name,slug,icon,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPlaces(options = {}) {
  let query = supabase
    .from("places")
    .select("*, category:place_categories(*)")
    .order("rating_avg", { ascending: false })
    .order("review_count", { ascending: false });

  if (!options.includePending) query = query.eq("status", "verified");

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizePlace(row));
}

export async function getFeaturedPlaces(limit = 6) {
  const places = await getPlaces();
  return [...places]
    .sort((a, b) => b.rating_avg - a.rating_avg || b.review_count - a.review_count)
    .slice(0, limit);
}

export async function getPlaceBySlug(slug) {
  const { data, error } = await supabase
    .from("places")
    .select("*, category:place_categories(*)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizePlace(data) : null;
}

export async function getPlacePhotos(placeId) {
  const { data, error } = await supabase
    .from("place_photos")
    .select("id,place_id,user_id,image_url,caption,created_at")
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((photo) => ({ ...photo, image_url: assetUrl(photo.image_url) }));
}

export async function getPlaceReviews(placeId) {
  const { data, error } = await supabase
    .from("place_reviews")
    .select(
      "id,place_id,user_id,rating,body,visited_at,created_at,author:profiles!place_reviews_user_id_fkey(id,name,avatar_url,role),photos:place_review_photos(image_url,sort_order)",
    )
    .eq("place_id", placeId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    place_id: row.place_id,
    user_id: row.user_id,
    rating: row.rating,
    body: row.body,
    visited_at: row.visited_at,
    created_at: row.created_at,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
    photos: (Array.isArray(row.photos) ? row.photos : [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((photo) => assetUrl(photo.image_url)),
  }));
}

export async function getSavedPlaces(userId) {
  const { data, error } = await supabase
    .from("saves")
    .select("place_id,place:places(*,category:place_categories(*))")
    .eq("user_id", userId)
    .not("place_id", "is", null);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((row) => {
      const place = Array.isArray(row.place) ? row.place[0] : row.place;
      return place ? normalizePlace(place, true) : null;
    })
    .filter(Boolean);
}

export async function isPlaceSaved(userId, placeId) {
  const { data } = await supabase
    .from("saves")
    .select("id")
    .eq("user_id", userId)
    .eq("place_id", placeId)
    .maybeSingle();
  return Boolean(data);
}
