// Auth actions ported from src/app/actions/auth.ts.
import { supabase } from "../supabase.js";
import { url } from "../config.js";
import { validateSignIn, validateSignUp } from "../validation.js";

export async function signIn(input) {
  const parsed = validateSignIn(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, message: "Email atau password belum cocok. Coba lagi." };
  }

  const next = new URLSearchParams(window.location.search).get("next") || "/jelajah";
  window.location.assign(url(next));
  return { ok: true };
}

export async function signUp(input) {
  const parsed = validateSignUp(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const origin = window.location.origin;
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name, campus_id: parsed.data.campus_id || null },
      emailRedirectTo: `${origin}${url("/auth/callback")}?next=/jelajah`,
    },
  });
  if (error) return { ok: false, message: error.message };

  if (!data.session) {
    return { ok: true, message: "Akun dibuat. Cek email untuk mengonfirmasi, lalu masuk kembali." };
  }

  window.location.assign(url("/jelajah"));
  return { ok: true };
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.assign(url("/"));
}
