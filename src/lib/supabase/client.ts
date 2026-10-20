import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";

export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
