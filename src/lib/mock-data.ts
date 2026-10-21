import { CATEGORY_FALLBACK, DEMO_PROFILE, POST_CATEGORIES } from "./constants";
import rawSeedPlaces from "./seed-places.json";
import type {
  AdminData,
  AuditLog,
  Campus,
  Category,
  Place,
  Post,
  PostCategory,
  PostComment,
  Profile,
  Report,
  Review,
} from "./types";

type SeedPlace = {
  id: string;
  osm_id: string;
  slug: string;
  name: string;
  category_slug: string;
  category_name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  price_min: number;
  price_max: number;
  price_level: number;
  facilities: string[];
  open_hours: Record<string, string>;
  rating_avg: number;
  review_count: number;
  source: "osm";
  tone: string;
};

const seedPlaces = rawSeedPlaces as SeedPlace[];

const FIXED_CREATED = "2026-10-01T08:00:00.000Z";
const FIXED_UPDATED = "2026-10-15T08:00:00.000Z";

export const MOCK_CAMPUS: Campus = {
  id: "campus-itpln",
  name: "Institut Teknologi PLN",
  slug: "itpln",
  city: "Jakarta Barat",
  latitude: -6.1682438,
  longitude: 106.7263723,
  radius_km: 5,
};

export const MOCK_CATEGORIES: Category[] = CATEGORY_FALLBACK;

const categoryBySlug = new Map(MOCK_CATEGORIES.map((category) => [category.slug, category]));

function categoryFor(slug: string): Category {
  return categoryBySlug.get(slug) ?? CATEGORY_FALLBACK[0];
}

export const MOCK_PROFILES: Profile[] = [
  DEMO_PROFILE,
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Rania Putri",
    email: "rania@wargakampus.local",
    role: "mahasiswa",
    campus_id: MOCK_CAMPUS.id,
    avatar_url: null,
    bio: "Mahasiswa Ilkom. Suka mencari tempat nugas yang tenang.",
    reputation_points: 84,
    is_active: true,
    created_at: FIXED_CREATED,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Dimas Arya",
    email: "dimas@wargakampus.local",
    role: "mahasiswa",
    campus_id: MOCK_CAMPUS.id,
    avatar_url: null,
    bio: "Teknik Elektro. Pengguna setia laundry kiloan.",
    reputation_points: 61,
    is_active: true,
    created_at: FIXED_CREATED,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Sari Lestari",
    email: "sari@wargakampus.local",
    role: "mahasiswa",
    campus_id: MOCK_CAMPUS.id,
    avatar_url: null,
    bio: "Bisnis Energi. Suka berbagi promo dan info kampus.",
    reputation_points: 47,
    is_active: true,
    created_at: FIXED_CREATED,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Bu Tini",
    email: "tini@wargakampus.local",
    role: "pemilik",
    campus_id: MOCK_CAMPUS.id,
    avatar_url: null,
    bio: "Pemilik warung di sekitar Duri Kosambi.",
    reputation_points: 12,
    is_active: true,
    created_at: FIXED_CREATED,
  },
];

const profileById = new Map(MOCK_PROFILES.map((profile) => [profile.id, profile]));
const profileByName = new Map(MOCK_PROFILES.map((profile) => [profile.name, profile]));

export const MOCK_PLACES: Place[] = seedPlaces.map((place) => ({
  id: place.id,
  slug: place.slug,
  name: place.name,
  category: categoryFor(place.category_slug),
  description: place.description,
  address: place.address,
  latitude: place.latitude,
  longitude: place.longitude,
  distance_km: place.distance_km,
  price_min: place.price_min,
  price_max: place.price_max,
  price_level: place.price_level,
  open_hours: place.open_hours,
  facilities: place.facilities,
  status: "verified",
  source: "osm",
  osm_id: place.osm_id,
  rating_avg: place.rating_avg,
  review_count: place.review_count,
  created_by: null,
  owner_id: null,
  campus_id: MOCK_CAMPUS.id,
  created_at: FIXED_CREATED,
  updated_at: FIXED_UPDATED,
  saved_by_me: ["mcdonald-s", "aura-laundry", "super-indo"].includes(place.slug),
}));

export const MOCK_PLACES_BY_SLUG = new Map(MOCK_PLACES.map((place) => [place.slug, place]));

function placeBySlug(slug: string): Place {
  const place = MOCK_PLACES_BY_SLUG.get(slug);
  if (!place) throw new Error(`Missing mock place: ${slug}`);
  return place;
}

function author(name: string): Pick<Profile, "id" | "name" | "avatar_url" | "role"> {
  const profile = profileByName.get(name);
  if (!profile) throw new Error(`Missing mock profile: ${name}`);
  return {
    id: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    role: profile.role,
  };
}

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

const reviewSeed: Array<[string, string, number, string, number]> = [
  ["rumah-makan-kampung-kecil-duri-kosambi", "Rania Putri", 5, "Ayam bakarnya besar, sambalnya enak. Ramai kalau jam makan siang, jadi datang agak awal.", 2],
  ["rumah-makan-kampung-kecil-duri-kosambi", "Dimas Arya", 4, "Porsinya pas untuk mahasiswa. Harga masih masuk akal untuk makan siang.", 5],
  ["kfc", "Sari Lestari", 4, "Dekat dari kampus, cocok kalau butuh makan cepat. Tempat duduknya cukup banyak.", 3],
  ["talaga-sampireun-puri", "Rania Putri", 5, "Tempatnya luas dan nyaman untuk makan bareng keluarga atau teman. Harga lebih tinggi, tapi suasananya bagus.", 6],
  ["mcdonald-s", "Rania Putri", 4, "WiFi kencang dan colokan banyak. Cocok buat nugas sore, tapi agak ramai di jam makan.", 1],
  ["mcdonald-s", "Dimas Arya", 4, "Buka sampai malam. Pesan kopi, kerja tugas, lalu pulang. Cukup nyaman.", 4],
  ["harris-cafe-harris-suites-puri-mansion", "Sari Lestari", 4, "Tenang dan adem. Cocok untuk kerja kelompok, tapi harga menu lebih premium.", 7],
  ["aura-laundry", "Dimas Arya", 5, "Rp7.000 per kilo, selesai sehari. Bisa antar-jemput, jadi tidak perlu keluar kos.", 2],
  ["sanggar-laundry", "Rania Putri", 4, "Hasil cuciannya bersih dan wangi. Lokasinya agak jauh dari kampus, tapi worth it.", 8],
  ["super-indo", "Sari Lestari", 4, "Lengkap untuk belanja kebutuhan kos. Sering ada promo telur dan minyak.", 1],
  ["rajawali-foto", "Rania Putri", 5, "Cetak dan jilid cepat. Buka sampai malam, jadi bisa ambil setelah kelas.", 3],
  ["spar", "Dimas Arya", 4, "Pilihan buah dan sayur lebih banyak daripada minimarket. Harga cukup bersaing.", 9],
];

export const MOCK_REVIEWS: Review[] = reviewSeed.map(([placeSlug, name, rating, body, days], index) => ({
  id: `review-${index + 1}`,
  place_id: placeBySlug(placeSlug).id,
  user_id: author(name).id,
  rating,
  body,
  visited_at: daysAgo(days + 1),
  created_at: daysAgo(days),
  author: author(name),
}));

function reviewsFor(placeSlug: string) {
  const place = placeBySlug(placeSlug);
  return MOCK_REVIEWS.filter((review) => review.place_id === place.id);
}

const postSeed: Array<{
  id: string;
  authorName: string;
  placeSlug: string;
  category: PostCategory;
  body: string;
  photos: string[];
  minutes: number;
  liked: number;
  saved?: boolean;
  comments: Array<{ authorName: string; body: string; minutes: number }>;
}> = [
  {
    id: "post-1",
    authorName: "Rania Putri",
    placeSlug: "mcdonald-s",
    category: "tips",
    body: "Tempat nugas favorit saya minggu ini: McDonald's di Lingkar Luar Barat. WiFi kencang, colokan banyak, dan buka sampai malam. Kopi refill Rp8 ribu. Datang sebelum jam 4 sore kalau mau dapat meja dekat colokan.",
    photos: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    ],
    minutes: 95,
    liked: 24,
    comments: [
      { authorName: "Dimas Arya", body: "Setuju. Parkirnya juga cukup luas kalau bawa motor.", minutes: 70 },
    ],
  },
  {
    id: "post-2",
    authorName: "Dimas Arya",
    placeSlug: "aura-laundry",
    category: "review",
    body: "Aura Laundry: Rp7.000 per kilo, selesai satu hari. Bisa antar-jemput. Sudah dua bulan langganan dan belum pernah telat. Catat nomor WhatsApp-nya di papan kos.",
    photos: [],
    minutes: 190,
    liked: 12,
    comments: [
      { authorName: "Rania Putri", body: "Antar-jemputnya bayar tambahan atau sudah termasuk?", minutes: 160 },
      { authorName: "Dimas Arya", body: "Tambahan Rp3.000 kalau jauh. Dekat kampus gratis.", minutes: 150 },
    ],
  },
  {
    id: "post-3",
    authorName: "Sari Lestari",
    placeSlug: "super-indo",
    category: "promo",
    body: "Super Indo dekat kampus lagi ada promo telur. Cocok buat patungan anak kos. Saya beli satu tray, dibagi empat, jadi lebih murah daripada beli satuan di minimarket.",
    photos: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    ],
    minutes: 320,
    liked: 31,
    saved: true,
    comments: [],
  },
  {
    id: "post-4",
    authorName: "Rania Putri",
    placeSlug: "harris-cafe-harris-suites-puri-mansion",
    category: "cari-teman",
    body: "Cari teman nugas sore ini di Harris Cafe. Saya bawa laptop dan colokan ekstensi. Rencananya dari jam 4 sampai jam 7. Boleh join, yang penting tidak berisik.",
    photos: [],
    minutes: 420,
    liked: 9,
    comments: [
      { authorName: "Sari Lestari", body: "Saya ikut sekitar jam 5, habis kelas.", minutes: 390 },
    ],
  },
  {
    id: "post-5",
    authorName: "Dimas Arya",
    placeSlug: "rumah-makan-kampung-kecil-duri-kosambi",
    category: "review",
    body: "Rumah Makan Kampung Kecil: ayam bakar Rp22 ribu, porsi besar, sambal ijo-nya pedas. Ramai jam 12, jadi datang jam 11 atau setelah jam 1. Tempat parkir motor cukup.",
    photos: [],
    minutes: 1440,
    liked: 18,
    comments: [],
  },
  {
    id: "post-6",
    authorName: "Sari Lestari",
    placeSlug: "rajawali-foto",
    category: "info-kampus",
    body: "Info: Rajawali Foto buka sampai jam 9 malam dan bisa jilid skripsi. Harga jilid mulai Rp15 ribu. Kalau mau cetak banyak, kirim file lewat WhatsApp dulu supaya tidak menunggu lama.",
    photos: [],
    minutes: 2880,
    liked: 27,
    saved: true,
    comments: [
      { authorName: "Rania Putri", body: "Bisa cetak warna juga? Untuk poster tugas.", minutes: 2800 },
    ],
  },
];

export const MOCK_POSTS: Post[] = postSeed.map((post) => {
  const place = placeBySlug(post.placeSlug);
  const comments: PostComment[] = post.comments.map((comment, index) => ({
    id: `${post.id}-comment-${index + 1}`,
    post_id: post.id,
    user_id: author(comment.authorName).id,
    parent_id: null,
    body: comment.body,
    created_at: minutesAgo(comment.minutes),
    author: author(comment.authorName),
  }));

  return {
    id: post.id,
    user_id: author(post.authorName).id,
    place_id: place.id,
    campus_id: MOCK_CAMPUS.id,
    category: post.category,
    body: post.body,
    visibility: "campus",
    status: "published",
    like_count: post.liked,
    comment_count: comments.length,
    created_at: minutesAgo(post.minutes),
    author: author(post.authorName),
    place: {
      id: place.id,
      slug: place.slug,
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      category: place.category,
    },
    photos: post.photos,
    comments,
    liked_by_me: false,
    saved_by_me: Boolean(post.saved),
  };
});

export const MOCK_COMMENTS: PostComment[] = MOCK_POSTS.flatMap((post) => post.comments);

export const MOCK_STATS = {
  verifiedPlaces: MOCK_PLACES.length,
  contributors: MOCK_PROFILES.filter((profile) => profile.role === "mahasiswa").length,
  postsThisWeek: MOCK_POSTS.length,
  reviews: MOCK_REVIEWS.length,
};

export const MOCK_PENDING_PLACES: Place[] = [
  {
    ...MOCK_PLACES[0],
    id: "demo-pending-1",
    status: "pending",
    name: "Warung Nasi Bu Tini",
    slug: "warung-nasi-bu-tini",
    category: categoryBySlug.get("makan") ?? CATEGORY_FALLBACK[0],
    description:
      "Warung nasi rumahan yang baru dibuka di dekat gerbang kampus. Menunggu verifikasi alamat dan jam buka.",
    address: "Jl. Lingkar Luar Barat, dekat gerbang timur kampus",
    latitude: -6.1685,
    longitude: 106.7268,
    price_min: 10000,
    price_max: 25000,
    price_level: 1,
    facilities: ["Makan di tempat", "Halal", "Parkir"],
    source: "user",
    created_by: MOCK_PROFILES[1].id,
    rating_avg: 0,
    review_count: 0,
  },
  {
    ...MOCK_PLACES[3],
    id: "demo-pending-2",
    status: "pending",
    name: "Print Express Duri Kosambi",
    slug: "print-express-duri-kosambi",
    category: categoryBySlug.get("fotokopi") ?? CATEGORY_FALLBACK[4],
    description:
      "Layanan cetak dan fotokopi yang mengaku buka 24 jam. Perlu dicek apakah benar buka malam.",
    address: "Jl. Duri Kosambi, seberang gang masuk kampus",
    latitude: -6.1679,
    longitude: 106.7259,
    price_min: 500,
    price_max: 5000,
    price_level: 1,
    facilities: ["Cetak", "Fotokopi", "Jilid"],
    source: "user",
    created_by: MOCK_PROFILES[2].id,
    rating_avg: 0,
    review_count: 0,
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "demo-report-1",
    reporter_id: MOCK_PROFILES[1].id,
    target_type: "place",
    target_id: MOCK_PLACES[0].id,
    reason: "Harga di halaman tempat sudah tidak sesuai. Sebaiknya dicek ulang.",
    status: "open",
    created_at: daysAgo(1),
    reporter: { id: MOCK_PROFILES[1].id, name: MOCK_PROFILES[1].name },
  },
  {
    id: "demo-report-2",
    reporter_id: MOCK_PROFILES[2].id,
    target_type: "post",
    target_id: MOCK_POSTS[2].id,
    reason: "Postingan promo ini mungkin duplikat dengan unggahan sebelumnya.",
    status: "open",
    created_at: daysAgo(2),
    reporter: { id: MOCK_PROFILES[2].id, name: MOCK_PROFILES[2].name },
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "demo-audit-1",
    admin_id: DEMO_PROFILE.id,
    action: "place.verified",
    target_type: "place",
    target_id: MOCK_PLACES[0].id,
    note: "Alamat dan kategori sudah dicek.",
    created_at: daysAgo(3),
    admin: { id: DEMO_PROFILE.id, name: DEMO_PROFILE.name },
  },
];

export const MOCK_ADMIN_DATA: AdminData = {
  pendingPlaces: MOCK_PENDING_PLACES,
  reports: MOCK_REPORTS,
  users: MOCK_PROFILES,
  auditLogs: MOCK_AUDIT_LOGS,
  stats: {
    pendingPlaces: MOCK_PENDING_PLACES.length,
    openReports: MOCK_REPORTS.filter((report) => report.status === "open").length,
    totalUsers: MOCK_PROFILES.length,
    totalPosts: MOCK_POSTS.length,
  },
};

export const MOCK_CURRENT_PROFILE = DEMO_PROFILE;

export const MOCK_SAVED_PLACES = MOCK_PLACES.filter((place) => place.saved_by_me);
export const MOCK_SAVED_POSTS = MOCK_POSTS.filter((post) => post.saved_by_me);

export function getMockPlaceReviews(slug: string) {
  return reviewsFor(slug);
}

export function getMockProfileById(id: string) {
  return profileById.get(id) ?? null;
}

export function getMockPostCategoryLabel(category: PostCategory) {
  return POST_CATEGORIES[category];
}
