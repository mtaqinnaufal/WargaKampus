// Public configuration + constants.
// Kredensial Supabase berada di js/config.local.js (diabaikan Git).
// Salin js/config.local.example.js -> js/config.local.js lalu isi nilainya.
let local = {};
try {
  local = await import("./config.local.js");
} catch {
  local = {};
}

export const SUPABASE_URL = local.SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = local.SUPABASE_ANON_KEY ?? "";
export const BASE = local.BASE ?? "";
export const DEMO_LOGIN_ENABLED = local.DEMO_LOGIN_ENABLED ?? true;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function url(path) {
  if (!path) return BASE || "/";
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE = {
  name: "WargaKampus",
  shortName: "WargaKampus",
  campusName: "Institut Teknologi PLN",
  campusShort: "ITPLN",
  city: "Jakarta Barat",
  description:
    "Peta komunitas warga kampus untuk menemukan tempat makan, nongkrong, nugas, laundry, dan kebutuhan harian di sekitar ITPLN.",
  campusSlug: "itpln",
  osmAttribution: "© OpenStreetMap contributors, ODbL",
  osmUrl: "https://www.openstreetmap.org/copyright",
};

export const CAMPUS_CENTER = {
  latitude: -6.1682438,
  longitude: 106.7263723,
  zoom: 15,
};

export const POST_CATEGORIES = {
  tips: "Tips",
  promo: "Promo",
  review: "Review singkat",
  "cari-teman": "Cari teman",
  "info-kampus": "Info kampus",
  curhat: "Curhat",
};

export const ROLE_LABELS = {
  mahasiswa: "Mahasiswa",
  pemilik: "Pemilik usaha",
  admin: "Admin",
};

export const PRICE_LEVELS = [
  { value: 1, label: "Hemat", hint: "Di bawah Rp15 ribu" },
  { value: 2, label: "Sedang", hint: "Rp15 ribu sampai Rp40 ribu" },
  { value: 3, label: "Premium", hint: "Rp40 ribu sampai Rp100 ribu" },
  { value: 4, label: "Mewah", hint: "Di atas Rp100 ribu" },
];

export const FACILITY_OPTIONS = [
  "WiFi",
  "Colokan",
  "AC",
  "Parkir",
  "Halal",
  "24 jam",
  "Makan di tempat",
  "Buka hingga malam",
  "Kiloan",
  "Express",
  "Antar-jemput",
  "Cetak",
  "Fotokopi",
  "Jilid",
  "Scan",
  "Akses kursi roda",
];

export const CATEGORY_FALLBACK = [
  { id: "cat-makan", name: "Makan", slug: "makan", icon: "utensils", sort_order: 1 },
  { id: "cat-nongkrong", name: "Nongkrong", slug: "nongkrong", icon: "armchair", sort_order: 2 },
  { id: "cat-nugas", name: "Nugas", slug: "nugas", icon: "laptop", sort_order: 3 },
  { id: "cat-laundry", name: "Laundry", slug: "laundry", icon: "washing-machine", sort_order: 4 },
  { id: "cat-fotokopi", name: "Fotokopi", slug: "fotokopi", icon: "printer", sort_order: 5 },
  { id: "cat-sembako", name: "Sembako", slug: "sembako", icon: "shopping-basket", sort_order: 6 },
  { id: "cat-kesehatan", name: "Kesehatan", slug: "kesehatan", icon: "heart-pulse", sort_order: 7 },
  { id: "cat-hiburan", name: "Hiburan", slug: "hiburan", icon: "ticket", sort_order: 8 },
];

export const APP_NAV = [
  { href: "/jelajah", label: "Jelajah" },
  { href: "/linimasa", label: "Linimasa" },
  { href: "/simpan", label: "Simpan" },
];

export const DEMO_PASSWORD = "WargaKampus123!";

export const DEMO_ACCOUNTS = {
  mahasiswa: { email: "rania@wargakampus.demo", destination: "/jelajah" },
  pemilik: { email: "tini@wargakampus.demo", destination: "/profil" },
  admin: { email: "admin@wargakampus.demo", destination: "/admin" },
};
