"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { signInSchema, signUpSchema } from "@/lib/validation";

export async function signInAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data login tidak valid." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message:
        "Mode demo belum punya autentikasi. Isi kredensial Supabase di .env.local untuk masuk dengan akun sungguhan.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: "Email atau password belum cocok. Coba lagi." };
  }

  redirect("/jelajah");
}

export async function signUpAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    campus_id: formData.get("campus_id") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data pendaftaran tidak valid." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message:
        "Mode demo belum punya autentikasi. Isi kredensial Supabase di .env.local untuk membuat akun.",
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
        campus_id: parsed.data.campus_id || null,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/jelajah`,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  if (!data.session) {
    return {
      ok: true,
      message: "Akun dibuat. Cek email untuk mengonfirmasi, lalu masuk kembali.",
    };
  }

  redirect("/jelajah");
}

export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
