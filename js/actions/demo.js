// Demo quick login ported from src/app/actions/demo.ts.
import { supabase } from "../supabase.js";
import { DEMO_ACCOUNTS, DEMO_LOGIN_ENABLED, DEMO_PASSWORD, url } from "../config.js";

export async function demoLogin(role) {
  if (!DEMO_LOGIN_ENABLED) {
    return { ok: false, message: "Quick login demo sedang dinonaktifkan." };
  }
  const account = DEMO_ACCOUNTS[role];
  if (!account) return { ok: false, message: "Role demo tidak dikenal." };

  const { error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: DEMO_PASSWORD,
  });
  if (error) {
    return {
      ok: false,
      message: "Akun demo belum tersedia. Jalankan `npm run seed:demo` terlebih dahulu.",
    };
  }

  window.location.assign(url(account.destination));
  return { ok: true };
}
