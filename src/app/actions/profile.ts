"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { profileSchema } from "@/lib/validation";
import { safeString } from "@/lib/utils";

export async function updateProfileAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    name: safeString(formData.get("name")),
    bio: safeString(formData.get("bio")),
    campus_id: safeString(formData.get("campus_id")) || undefined,
    avatar_url: safeString(formData.get("avatar_url")),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Profil belum valid." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message:
        "Mode demo belum menyimpan perubahan. Isi kredensial Supabase di .env.local untuk mengaktifkan database.",
    };
  }

  const { profile } = await getCurrentUser();
  if (!profile) {
    return { ok: false, message: "Masuk terlebih dahulu untuk mengubah profil." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      campus_id: parsed.data.campus_id || profile.campus_id,
      avatar_url: parsed.data.avatar_url || null,
    })
    .eq("id", profile.id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/profil");
  revalidatePath("/");
  return { ok: true, message: "Profil diperbarui." };
}
