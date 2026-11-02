// Supabase browser client. The UMD build exposes window.supabase.
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config.js";

const { createClient } = window.supabase;

function notConfigured() {
  throw new Error(
    "Supabase belum dikonfigurasi. Salin js/config.local.example.js menjadi js/config.local.js lalu isi URL dan publishable key.",
  );
}

function createStub() {
  return {
    from: notConfigured,
    rpc: notConfigured,
    auth: {
      getUser: async () => {
        notConfigured();
      },
      signInWithPassword: async () => {
        notConfigured();
      },
      signUp: async () => {
        notConfigured();
      },
      signOut: async () => {
        notConfigured();
      },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    storage: {
      from: () => ({
        upload: async () => {
          notConfigured();
        },
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createStub();
