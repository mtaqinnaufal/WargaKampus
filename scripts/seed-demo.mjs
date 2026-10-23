import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SECRET_KEY (atau SUPABASE_SERVICE_ROLE_KEY) wajib ada di .env.local.",
  );
  console.error("Jalankan: npm run seed:demo");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_PASSWORD = "WargaKampus123!";

const demoUsers = [
  {
    email: "admin@wargakampus.demo",
    name: "Admin WargaKampus",
    role: "admin",
    bio: "Admin komunitas WargaKampus.",
    reputation_points: 100,
  },
  {
    email: "rania@wargakampus.demo",
    name: "Rania Putri",
    role: "mahasiswa",
    bio: "Mahasiswa Ilkom. Suka mencari tempat nugas yang tenang.",
    reputation_points: 84,
  },
  {
    email: "dimas@wargakampus.demo",
    name: "Dimas Arya",
    role: "mahasiswa",
    bio: "Teknik Elektro. Pengguna setia laundry kiloan.",
    reputation_points: 61,
  },
  {
    email: "sari@wargakampus.demo",
    name: "Sari Lestari",
    role: "mahasiswa",
    bio: "Bisnis Energi. Suka berbagi promo dan info kampus.",
    reputation_points: 47,
  },
  {
    email: "tini@wargakampus.demo",
    name: "Bu Tini",
    role: "pemilik",
    bio: "Pemilik warung di sekitar Duri Kosambi.",
    reputation_points: 12,
  },
];

const postSeeds = [
  {
    key: "nugas-mcd",
    author: "rania@wargakampus.demo",
    placeSlug: "mcdonald-s",
    category: "tips",
    body: "Tempat nugas favorit saya minggu ini: McDonald's di Lingkar Luar Barat. WiFi kencang, colokan banyak, dan buka sampai malam. Kopi refill Rp8 ribu. Datang sebelum jam 4 sore kalau mau dapat meja dekat colokan.",
    photos: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    ],
    comments: [
      { author: "dimas@wargakampus.demo", body: "Setuju. Parkirnya juga cukup luas kalau bawa motor." },
    ],
    likes: ["dimas@wargakampus.demo", "sari@wargakampus.demo"],
  },
  {
    key: "laundry-aura",
    author: "dimas@wargakampus.demo",
    placeSlug: "aura-laundry",
    category: "review",
    body: "Aura Laundry: Rp7.000 per kilo, selesai satu hari. Bisa antar-jemput. Sudah dua bulan langganan dan belum pernah telat. Catat nomor WhatsApp-nya di papan kos.",
    photos: [],
    comments: [
      { author: "rania@wargakampus.demo", body: "Antar-jemputnya bayar tambahan atau sudah termasuk?" },
      { author: "dimas@wargakampus.demo", body: "Tambahan Rp3.000 kalau jauh. Dekat kampus gratis." },
    ],
    likes: ["rania@wargakampus.demo"],
  },
  {
    key: "promo-superindo",
    author: "sari@wargakampus.demo",
    placeSlug: "super-indo",
    category: "promo",
    body: "Super Indo dekat kampus lagi ada promo telur. Cocok buat patungan anak kos. Saya beli satu tray, dibagi empat, jadi lebih murah daripada beli satuan di minimarket.",
    photos: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    ],
    comments: [],
    likes: ["rania@wargakampus.demo", "dimas@wargakampus.demo", "tini@wargakampus.demo"],
  },
  {
    key: "cari-teman-harris",
    author: "rania@wargakampus.demo",
    placeSlug: "harris-cafe-harris-suites-puri-mansion",
    category: "cari-teman",
    body: "Cari teman nugas sore ini di Harris Cafe. Saya bawa laptop dan colokan ekstensi. Rencananya dari jam 4 sampai jam 7. Boleh join, yang penting tidak berisik.",
    photos: [],
    comments: [
      { author: "sari@wargakampus.demo", body: "Saya ikut sekitar jam 5, habis kelas." },
    ],
    likes: ["sari@wargakampus.demo"],
  },
  {
    key: "review-kampung-kecil",
    author: "dimas@wargakampus.demo",
    placeSlug: "rumah-makan-kampung-kecil-duri-kosambi",
    category: "review",
    body: "Rumah Makan Kampung Kecil: ayam bakar Rp22 ribu, porsi besar, sambal ijo-nya pedas. Ramai jam 12, jadi datang jam 11 atau setelah jam 1. Tempat parkir motor cukup.",
    photos: [],
    comments: [],
    likes: ["rania@wargakampus.demo", "sari@wargakampus.demo"],
  },
  {
    key: "info-rajawali",
    author: "sari@wargakampus.demo",
    placeSlug: "rajawali-foto",
    category: "info-kampus",
    body: "Info: Rajawali Foto buka sampai jam 9 malam dan bisa jilid skripsi. Harga jilid mulai Rp15 ribu. Kalau mau cetak banyak, kirim file lewat WhatsApp dulu supaya tidak menunggu lama.",
    photos: [],
    comments: [
      { author: "rania@wargakampus.demo", body: "Bisa cetak warna juga? Untuk poster tugas." },
    ],
    likes: ["rania@wargakampus.demo", "dimas@wargakampus.demo"],
  },
  {
    key: "promo-warung-tini",
    author: "tini@wargakampus.demo",
    placeSlug: "warung-bu-tini",
    category: "promo",
    body: "Warung Bu Tini buka sampai jam 9 malam. Hari ini ada paket ayam bakar + sayur + es teh Rp20 ribu. Dekat dari kampus, parkir motor di depan warung. Tunjukkan halaman WargaKampus untuk dapat harga paket.",
    photos: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    ],
    comments: [
      { author: "rania@wargakampus.demo", body: "Mantap, besok saya mampir setelah kelas." },
      { author: "dimas@wargakampus.demo", body: "Paketnya cocok untuk makan siang. Bisa bungkus?" },
    ],
    likes: ["rania@wargakampus.demo", "sari@wargakampus.demo"],
  },
];

const reviewSeeds = [
  { email: "rania@wargakampus.demo", placeSlug: "rumah-makan-kampung-kecil-duri-kosambi", rating: 5, body: "Ayam bakarnya besar, sambalnya enak. Ramai kalau jam makan siang, jadi datang agak awal." },
  { email: "dimas@wargakampus.demo", placeSlug: "rumah-makan-kampung-kecil-duri-kosambi", rating: 4, body: "Porsinya pas untuk mahasiswa. Harga masih masuk akal untuk makan siang." },
  { email: "sari@wargakampus.demo", placeSlug: "kfc", rating: 4, body: "Dekat dari kampus, cocok kalau butuh makan cepat. Tempat duduknya cukup banyak." },
  { email: "rania@wargakampus.demo", placeSlug: "talaga-sampireun-puri", rating: 5, body: "Tempatnya luas dan nyaman untuk makan bareng keluarga atau teman. Harga lebih tinggi, tapi suasananya bagus." },
  { email: "rania@wargakampus.demo", placeSlug: "mcdonald-s", rating: 4, body: "WiFi kencang dan colokan banyak. Cocok buat nugas sore, tapi agak ramai di jam makan." },
  { email: "dimas@wargakampus.demo", placeSlug: "mcdonald-s", rating: 4, body: "Buka sampai malam. Pesan kopi, kerja tugas, lalu pulang. Cukup nyaman." },
  { email: "sari@wargakampus.demo", placeSlug: "harris-cafe-harris-suites-puri-mansion", rating: 4, body: "Tenang dan adem. Cocok untuk kerja kelompok, tapi harga menu lebih premium." },
  { email: "dimas@wargakampus.demo", placeSlug: "aura-laundry", rating: 5, body: "Rp7.000 per kilo, selesai sehari. Bisa antar-jemput, jadi tidak perlu keluar kos." },
  { email: "rania@wargakampus.demo", placeSlug: "sanggar-laundry", rating: 4, body: "Hasil cuciannya bersih dan wangi. Lokasinya agak jauh dari kampus, tapi worth it." },
  { email: "sari@wargakampus.demo", placeSlug: "super-indo", rating: 4, body: "Lengkap untuk belanja kebutuhan kos. Sering ada promo telur dan minyak." },
  { email: "rania@wargakampus.demo", placeSlug: "rajawali-foto", rating: 5, body: "Cetak dan jilid cepat. Buka sampai malam, jadi bisa ambil setelah kelas." },
  { email: "dimas@wargakampus.demo", placeSlug: "spar", rating: 4, body: "Pilihan buah dan sayur lebih banyak daripada minimarket. Harga cukup bersaing." },
  { email: "tini@wargakampus.demo", placeSlug: "super-indo", rating: 5, body: "Belanja bahan warung di sini. Harga telur dan minyak cukup bersaing, tapi datang pagi supaya stoknya lengkap." },
];

const demoPlaces = [
  {
    slug: "warung-bu-tini",
    name: "Warung Bu Tini",
    categorySlug: "makan",
    description:
      "Warung nasi rumahan dengan ayam bakar, sayur, dan sambal khas. Porsi cukup untuk makan siang mahasiswa.",
    address: "Jl. Duri Kosambi Raya, Cengkareng, Jakarta Barat",
    latitude: -6.16762,
    longitude: 106.72591,
    price_min: 10000,
    price_max: 25000,
    price_level: 1,
    open_hours: { note: "Senin-Sabtu 10.00-21.00" },
    facilities: ["Makan di tempat", "Halal", "Parkir"],
    status: "verified",
    creator: "tini@wargakampus.demo",
    owner: "tini@wargakampus.demo",
    isClaimed: true,
    daysAgo: 12,
  },
  {
    slug: "katering-bu-tini",
    name: "Katering Bu Tini",
    categorySlug: "makan",
    description:
      "Katering harian untuk anak kos dan acara kecil. Pesan minimal lima porsi, bisa antar ke sekitar kampus.",
    address: "Jl. Duri Kosambi, Cengkareng, Jakarta Barat",
    latitude: -6.16911,
    longitude: 106.72822,
    price_min: 12000,
    price_max: 30000,
    price_level: 1,
    open_hours: { note: "Senin-Jumat 07.00-17.00" },
    facilities: ["Halal", "Antar-jemput", "Pesan dulu"],
    status: "verified",
    creator: "tini@wargakampus.demo",
    owner: "tini@wargakampus.demo",
    isClaimed: true,
    daysAgo: 10,
  },
  {
    slug: "kedai-kopi-rania",
    name: "Kedai Kopi Rania",
    categorySlug: "nongkrong",
    description:
      "Kedai kopi kecil dengan meja kerja, WiFi, dan colokan. Cocok untuk nugas sore. Menunggu verifikasi admin.",
    address: "Jl. Lingkar Luar Barat, Duri Kosambi, Jakarta Barat",
    latitude: -6.1669,
    longitude: 106.7274,
    price_min: 15000,
    price_max: 35000,
    price_level: 2,
    open_hours: { note: "Setiap hari 09.00-22.00" },
    facilities: ["WiFi", "Colokan", "AC"],
    status: "pending",
    creator: "rania@wargakampus.demo",
    owner: null,
    isClaimed: false,
    daysAgo: 2,
  },
  {
    slug: "laundry-kilat-dimas",
    name: "Laundry Kilat Dimas",
    categorySlug: "laundry",
    description:
      "Laundry kiloan dengan layanan express enam jam dan antar-jemput. Menunggu verifikasi admin.",
    address: "Jl. Duri Kosambi Raya, Cengkareng, Jakarta Barat",
    latitude: -6.1703,
    longitude: 106.7248,
    price_min: 6000,
    price_max: 12000,
    price_level: 1,
    open_hours: { note: "Setiap hari 07.00-21.00" },
    facilities: ["Kiloan", "Express", "Antar-jemput"],
    status: "pending",
    creator: "dimas@wargakampus.demo",
    owner: null,
    isClaimed: false,
    daysAgo: 1,
  },
];

const categoryMedia = {
  makan: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
  ],
  nongkrong: [
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  ],
  nugas: [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  ],
  laundry: [
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1000&q=80",
  ],
  fotokopi: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80",
  ],
  sembako: [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
  ],
  kesehatan: [
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
  ],
  hiburan: [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80",
  ],
};

const defaultMedia = categoryMedia.makan;

const reportSeeds = [
  {
    reporter: "dimas@wargakampus.demo",
    targetType: "post",
    targetKey: "promo-superindo",
    reason: "Promo telur ini sudah tidak berlaku saat saya datang. Harga di rak berbeda dari postingan.",
    hoursAgo: 2,
  },
  {
    reporter: "rania@wargakampus.demo",
    targetType: "place",
    targetKey: "warung-bu-tini",
    reason: "Pin Warung Bu Tini di peta bergeser sedikit ke arah jalan utama. Mohon dicek alamatnya.",
    hoursAgo: 5,
  },
];

const auditSeeds = [
  {
    action: "place.verify",
    targetType: "place",
    targetKey: "warung-bu-tini",
    note: "Data Warung Bu Tini diverifikasi.",
    hoursAgo: 8,
  },
  {
    action: "report.review",
    targetType: "report",
    targetKey: "first-report",
    note: "Laporan promo ditinjau, menunggu konfirmasi.",
    hoursAgo: 3,
  },
  {
    action: "profile.role_update",
    targetType: "user",
    targetKey: "tini@wargakampus.demo",
    note: "Peran Bu Tini diubah menjadi pemilik usaha.",
    hoursAgo: 12,
  },
];

function fail(message) {
  console.error(`\nGagal: ${message}\n`);
  process.exit(1);
}

async function getOrCreateUser(definition, campusId) {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) fail(listError.message);

  const existing = list.users.find(
    (user) => user.email?.toLowerCase() === definition.email.toLowerCase(),
  );
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email: definition.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: {
      name: definition.name,
      campus_id: campusId,
    },
  });
  if (error) fail(`membuat user ${definition.email}: ${error.message}`);
  return data.user;
}

async function main() {
  console.log("WargaKampus demo seed");
  console.log("Menyiapkan data demo...\n");

  const { data: campus, error: campusError } = await supabase
    .from("campuses")
    .select("id, name")
    .eq("slug", "itpln")
    .maybeSingle();

  if (campusError) fail(campusError.message);
  if (!campus) fail("Kampus ITPLN tidak ditemukan. Jalankan supabase/seed.sql terlebih dahulu.");

  const usersByEmail = new Map();

  for (const definition of demoUsers) {
    const user = await getOrCreateUser(definition, campus.id);
    usersByEmail.set(definition.email, user);

    const { error } = await supabase
      .from("profiles")
      .update({
        name: definition.name,
        role: definition.role,
        bio: definition.bio,
        campus_id: campus.id,
        reputation_points: definition.reputation_points,
        is_active: true,
      })
      .eq("id", user.id);

    if (error) fail(`memperbarui profil ${definition.email}: ${error.message}`);
    console.log(`  user  ${definition.email}`);
  }

  const userIds = [...usersByEmail.values()].map((user) => user.id);

  const { data: categories, error: categoriesError } = await supabase
    .from("place_categories")
    .select("id, slug");
  if (categoriesError) fail(categoriesError.message);

  const categoryBySlug = new Map(
    (categories ?? []).map((category) => [category.slug, category]),
  );

  const placeRows = demoPlaces.map((seed) => {
    const category = categoryBySlug.get(seed.categorySlug);
    const creator = usersByEmail.get(seed.creator);
    const owner = seed.owner ? usersByEmail.get(seed.owner) : null;

    if (!category) {
      fail(`kategori ${seed.categorySlug} tidak ditemukan. Jalankan supabase/seed.sql.`);
    }
    if (!creator) fail(`pembuat tempat ${seed.creator} tidak ditemukan.`);

    return {
      campus_id: campus.id,
      category_id: category.id,
      name: seed.name,
      slug: seed.slug,
      description: seed.description,
      address: seed.address,
      latitude: seed.latitude,
      longitude: seed.longitude,
      price_min: seed.price_min,
      price_max: seed.price_max,
      price_level: seed.price_level,
      open_hours: seed.open_hours,
      facilities: seed.facilities,
      status: seed.status,
      is_claimed: seed.isClaimed ?? false,
      created_by: creator.id,
      owner_id: owner?.id ?? null,
      osm_id: null,
      source: "user",
      created_at: new Date(Date.now() - seed.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    };
  });

  const { error: placeSeedError } = await supabase
    .from("places")
    .upsert(placeRows, { onConflict: "slug" });
  if (placeSeedError) fail(`menyiapkan tempat demo: ${placeSeedError.message}`);
  console.log(`  place ${demoPlaces.length} demo (pemilik + antrean admin)`);

  const { data: places, error: placesError } = await supabase
    .from("places")
    .select(
      "id, slug, name, owner_id, created_by, category:place_categories(slug,name)",
    )
    .eq("campus_id", campus.id);

  if (placesError) fail(placesError.message);
  if (!places?.length) fail("Tempat belum ada. Jalankan supabase/seed.sql terlebih dahulu.");

  const placeBySlug = new Map(places.map((place) => [place.slug, place]));

  const allPlaceIds = places.map((place) => place.id);

  if (allPlaceIds.length > 0) {
    const { error } = await supabase
      .from("place_photos")
      .delete()
      .in("place_id", allPlaceIds);
    if (error) fail(`membersihkan media demo: ${error.message}`);
  }

  const mediaRows = [];
  for (const place of places) {
    const category = Array.isArray(place.category) ? place.category[0] : place.category;
    const images = categoryMedia[category?.slug] ?? defaultMedia;
    const pricelistUrl = ["warung-bu-tini", "katering-bu-tini"].includes(place.slug)
      ? `/demo/pricelist-${place.slug}.png`
      : `/demo/pricelists/${place.slug}.png`;

    for (const row of [
      { caption: "banner", image_url: images[0] },
      { caption: "pricelist", image_url: pricelistUrl },
      { caption: "foto", image_url: images[1] },
      { caption: "foto", image_url: images[2] ?? images[1] },
    ]) {
      mediaRows.push({
        place_id: place.id,
        user_id: place.owner_id ?? place.created_by ?? null,
        ...row,
      });
    }
  }

  if (mediaRows.length > 0) {
    const { error } = await supabase.from("place_photos").insert(mediaRows);
    if (error) fail(`menambahkan media semua tempat: ${error.message}`);
  }
  console.log(`  media ${mediaRows.length} demo (semua tempat)`);

  await supabase.from("posts").delete().in("user_id", userIds);
  await supabase.from("place_reviews").delete().in("user_id", userIds);
  await supabase.from("saves").delete().in("user_id", userIds);

  const postsByKey = new Map();

  for (const seed of postSeeds) {
    const author = usersByEmail.get(seed.author);
    if (!author) continue;
    const place = placeBySlug.get(seed.placeSlug);

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: author.id,
        place_id: place?.id ?? null,
        campus_id: campus.id,
        category: seed.category,
        body: seed.body,
        // Public so the feed is visible before login. Real user posts default to campus.
        visibility: "public",
        status: "published",
      })
      .select("id")
      .single();

    if (error) fail(`membuat postingan ${seed.key}: ${error.message}`);
    postsByKey.set(seed.key, post.id);

    for (let index = 0; index < seed.photos.length; index += 1) {
      const { error: photoError } = await supabase.from("post_photos").insert({
        post_id: post.id,
        image_url: seed.photos[index],
        sort_order: index,
      });
      if (photoError) fail(`menambahkan foto ${seed.key}: ${photoError.message}`);
    }

    for (const comment of seed.comments) {
      const commentAuthor = usersByEmail.get(comment.author);
      if (!commentAuthor) continue;
      const { error: commentError } = await supabase.from("comments").insert({
        post_id: post.id,
        user_id: commentAuthor.id,
        body: comment.body,
      });
      if (commentError) fail(`menambahkan komentar ${seed.key}: ${commentError.message}`);
    }

    for (const likeEmail of seed.likes) {
      const liker = usersByEmail.get(likeEmail);
      if (!liker) continue;
      const { error: likeError } = await supabase.from("post_likes").upsert(
        { post_id: post.id, user_id: liker.id },
        { onConflict: "post_id,user_id", ignoreDuplicates: true },
      );
      if (likeError) fail(`menambahkan like ${seed.key}: ${likeError.message}`);
    }

    console.log(`  post  ${seed.key}`);
  }

  for (const seed of reviewSeeds) {
    const author = usersByEmail.get(seed.email);
    const place = placeBySlug.get(seed.placeSlug);
    if (!author || !place) continue;

    const { error } = await supabase.from("place_reviews").upsert(
      {
        place_id: place.id,
        user_id: author.id,
        rating: seed.rating,
        body: seed.body,
      },
      { onConflict: "place_id,user_id" },
    );

    if (error) fail(`menambahkan ulasan ${seed.placeSlug}: ${error.message}`);
  }

  await supabase.from("reports").delete().in("reporter_id", userIds);

  const reportIds = [];
  for (const seed of reportSeeds) {
    const reporter = usersByEmail.get(seed.reporter);
    const targetId =
      seed.targetType === "post"
        ? postsByKey.get(seed.targetKey)
        : placeBySlug.get(seed.targetKey)?.id;

    if (!reporter || !targetId) continue;

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        reporter_id: reporter.id,
        target_type: seed.targetType,
        target_id: targetId,
        reason: seed.reason,
        status: "open",
        created_at: new Date(
          Date.now() - seed.hoursAgo * 60 * 60 * 1000,
        ).toISOString(),
      })
      .select("id")
      .single();

    if (error) fail(`membuat laporan demo: ${error.message}`);
    reportIds.push(report.id);
  }
  console.log(`  report ${reportIds.length} demo`);

  const admin = usersByEmail.get("admin@wargakampus.demo");
  if (admin) {
    await supabase.from("audit_logs").delete().eq("admin_id", admin.id);

    const auditRows = auditSeeds
      .map((seed) => {
        let targetId = null;

        if (seed.targetType === "report") {
          targetId = reportIds[0] ?? null;
        } else if (seed.targetType === "user") {
          targetId = usersByEmail.get(seed.targetKey)?.id ?? null;
        } else {
          targetId = placeBySlug.get(seed.targetKey)?.id ?? null;
        }

        if (!targetId) return null;

        return {
          admin_id: admin.id,
          action: seed.action,
          target_type: seed.targetType,
          target_id: targetId,
          note: seed.note,
          created_at: new Date(
            Date.now() - seed.hoursAgo * 60 * 60 * 1000,
          ).toISOString(),
        };
      })
      .filter(Boolean);

    if (auditRows.length > 0) {
      const { error } = await supabase.from("audit_logs").insert(auditRows);
      if (error) fail(`membuat audit log demo: ${error.message}`);
    }
    console.log(`  audit ${auditRows.length} demo`);
  }

  // A few saved items for the mahasiswa demo account so the Simpan page is not empty.
  const rania = usersByEmail.get("rania@wargakampus.demo");
  if (rania) {
    for (const key of ["promo-superindo", "info-rajawali"]) {
      const postId = postsByKey.get(key);
      if (!postId) continue;
      const { error } = await supabase.from("saves").insert({
        user_id: rania.id,
        post_id: postId,
      });
      if (error && error.code !== "23505") {
        fail(`menambahkan simpanan postingan ${key}: ${error.message}`);
      }
    }

    for (const slug of ["super-indo", "mcdonald-s", "aura-laundry"]) {
      const place = placeBySlug.get(slug);
      if (!place) continue;
      const { error } = await supabase.from("saves").insert({
        user_id: rania.id,
        place_id: place.id,
      });
      if (error && error.code !== "23505") {
        fail(`menambahkan simpanan tempat ${slug}: ${error.message}`);
      }
    }

    console.log("  saves Rania");
  }

  console.log("\nSelesai.");
  console.log(`Akun demo (password: ${DEMO_PASSWORD}):`);
  for (const definition of demoUsers) {
    console.log(`  ${definition.email}  ${definition.name} (${definition.role})`);
  }
  console.log("\nBuka http://localhost:3000 dan masuk dengan salah satu akun di atas.");
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
