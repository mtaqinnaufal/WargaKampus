"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const DEMO_PASSWORD = "WargaKampus123!";

const DEMO_ACCOUNTS = {
  mahasiswa: {
    email: "rania@wargakampus.demo",
    destination: "/jelajah",
  },
  pemilik: {
    email: "tini@wargakampus.demo",
    destination: "/profil",
  },
  admin: {
    email: "admin@wargakampus.demo",
    destination: "/admin",
  },
} as const;

export type DemoRole = keyof typeof DEMO_ACCOUNTS;

export async function demoLoginAction(role: DemoRole): Promise<ActionResult> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
    };
  }

  if (process.env.DEMO_LOGIN_ENABLED === "false") {
    return {
      ok: false,
      message: "Quick login demo sedang dinonaktifkan.",
    };
  }

  const account = DEMO_ACCOUNTS[role];
  if (!account) {
    return { ok: false, message: "Role demo tidak dikenal." };
  }

  const supabase = await createClient();
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

  redirect(account.destination);
}
