export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

// New projects should use the publishable key. Legacy anon keys still work.
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

// Server-only. Used by scripts/seed-demo.mjs. New projects should use the secret key.
export const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
