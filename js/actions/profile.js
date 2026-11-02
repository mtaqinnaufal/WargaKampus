// Profile action ported from src/app/actions/profile.ts (does not touch avatar_url).
import { supabase } from "../supabase.js";
import { getCurrentUser, clearUserCache } from "../auth.js";
import { validateProfile } from "../validation.js";

export async function updateProfile(input) {
  const parsed = validateProfile(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const current = await getCurrentUser();
  if (!current.profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk mengubah profil." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      campus_id: parsed.data.campus_id || current.profile.campus_id,
    })
    .eq("id", current.profile.id);

  if (error) return { ok: false, message: error.message };
  clearUserCache();
  return { ok: true, message: "Profil diperbarui." };
}
