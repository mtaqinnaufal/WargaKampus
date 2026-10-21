import type { Category, PostCategory, Profile, Role } from "./types";

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

export const POST_CATEGORIES: Record<PostCategory, string> = {
  tips: "Tips",
  promo: "Promo",
  review: "Review singkat",
  "cari-teman": "Cari teman",
  "info-kampus": "Info kampus",
  curhat: "Curhat",
};

export const ROLE_LABELS: Record<Role, string> = {
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

export const CATEGORY_FALLBACK: Category[] = [
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

export const DEMO_PROFILE: Profile = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Admin WargaKampus",
  email: "demo@wargakampus.local",
  role: "admin",
  campus_id: "campus-itpln",
  avatar_url: null,
  bio: "Mode demo. Data contoh dari OpenStreetMap dan komunitas.",
  reputation_points: 120,
  is_active: true,
  created_at: "2026-10-01T08:00:00.000Z",
};
