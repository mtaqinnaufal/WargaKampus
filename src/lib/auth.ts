import { cache } from "react";
import { redirect } from "next/navigation";
import { MOCK_CURRENT_PROFILE } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Profile } from "@/lib/types";

export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  if (!isSupabaseConfigured) {
    return {
      profile: MOCK_CURRENT_PROFILE,
      user: { id: MOCK_CURRENT_PROFILE.id, email: MOCK_CURRENT_PROFILE.email },
      isDemo: true,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { profile: null, user: null, isDemo: false };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,role,campus_id,avatar_url,bio,reputation_points,created_at")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return { profile: null, user, isDemo: false };
  }

  return {
    profile: { ...(data as Profile), is_active: true },
    user,
    isDemo: false,
  };
});

export async function requireUser() {
  const current = await getCurrentUser();
  if (!current.profile) {
    redirect("/masuk?next=/jelajah");
  }
  return { ...current, profile: current.profile };
}

export async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current.profile) {
    redirect("/masuk?next=/admin");
  }
  if (current.profile.role !== "admin") {
    redirect("/jelajah");
  }
  return { ...current, profile: current.profile };
}
