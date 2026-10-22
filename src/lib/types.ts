export type Role = "mahasiswa" | "pemilik" | "admin";
export type PlaceStatus = "pending" | "verified" | "rejected" | "closed";
export type PlaceSource = "user" | "osm" | "demo";
export type PostCategory = "tips" | "promo" | "review" | "cari-teman" | "info-kampus" | "curhat";
export type Visibility = "campus" | "public";
export type ReportStatus = "open" | "reviewed" | "actioned" | "rejected";

export interface Campus {
  id: string;
  name: string;
  slug: string;
  city: string;
  latitude: number;
  longitude: number;
  radius_km: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
}

export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: Role;
  campus_id: string | null;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  is_active: boolean;
  created_at: string;
}

export interface Place {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_km?: number;
  price_min: number | null;
  price_max: number | null;
  price_level: number;
  open_hours: Record<string, string>;
  facilities: string[];
  status: PlaceStatus;
  source: PlaceSource;
  osm_id: string | null;
  rating_avg: number;
  review_count: number;
  created_by: string | null;
  owner_id: string | null;
  campus_id: string;
  created_at: string;
  updated_at: string;
  saved_by_me?: boolean;
}

export interface PlacePhoto {
  id: string;
  place_id: string;
  user_id: string | null;
  image_url: string;
  caption: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  rating: number;
  body: string | null;
  visited_at: string | null;
  created_at: string;
  author: Pick<Profile, "id" | "name" | "avatar_url" | "role">;
  place?: Pick<Place, "id" | "slug" | "name">;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  author: Pick<Profile, "id" | "name" | "avatar_url" | "role">;
}

export interface Post {
  id: string;
  user_id: string;
  place_id: string | null;
  campus_id: string;
  category: PostCategory;
  body: string;
  visibility: Visibility;
  status: "published" | "hidden" | "removed";
  like_count: number;
  comment_count: number;
  created_at: string;
  author: Pick<Profile, "id" | "name" | "avatar_url" | "role">;
  place: Pick<Place, "id" | "slug" | "name" | "latitude" | "longitude" | "category"> | null;
  photos: string[];
  comments: PostComment[];
  liked_by_me: boolean;
  saved_by_me: boolean;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: "place" | "post" | "comment" | "user";
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  reporter?: Pick<Profile, "id" | "name">;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  note: string | null;
  created_at: string;
  admin?: Pick<Profile, "id" | "name">;
}

export interface CurrentUser {
  profile: Profile | null;
  user: { id: string; email?: string } | null;
  isDemo: boolean;
}

export interface AdminData {
  pendingPlaces: Place[];
  reports: Report[];
  users: Profile[];
  auditLogs: AuditLog[];
  stats: {
    pendingPlaces: number;
    openReports: number;
    totalUsers: number;
    totalPosts: number;
  };
}

export interface ActionResult {
  ok: boolean;
  message?: string;
  data?: unknown;
  placeId?: string;
  slug?: string;
}

export interface PlaceFilters {
  query?: string;
  category?: string;
  priceLevel?: number | null;
  facility?: string | null;
  maxDistance?: number | null;
}
