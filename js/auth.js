// Current-user helpers. Mirrors src/lib/auth.ts (client-side, no cache()).
import { supabase } from "./supabase.js";
import { url } from "./config.js";

let cachePromise = null;

async function load() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { profile: null, user: null };

  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,role,campus_id,avatar_url,bio,reputation_points,created_at")
    .eq("id", user.id)
    .single();

  if (error || !data) return { profile: null, user };
  return { profile: { ...data, is_active: true }, user };
}

export function getCurrentUser({ force = false } = {}) {
  if (force) cachePromise = null;
  if (!cachePromise) cachePromise = load();
  return cachePromise;
}

export function clearUserCache() {
  cachePromise = null;
}

export async function requireUser(next) {
  const current = await getCurrentUser();
  if (!current.profile) {
    const target = next || window.location.pathname;
    window.location.assign(url(`/masuk?next=${encodeURIComponent(target)}`));
    return null;
  }
  return current;
}

export async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current.profile) {
    window.location.assign(url("/masuk?next=/admin"));
    return null;
  }
  if (current.profile.role !== "admin") {
    window.location.assign(url("/jelajah"));
    return null;
  }
  return current;
}

export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    clearUserCache();
    callback(event, session);
  });
}
