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

  const { data: places, error: placesError } = await supabase
    .from("places")
    .select("id, slug, name")
    .eq("campus_id", campus.id);

  if (placesError) fail(placesError.message);
  if (!places?.length) fail("Tempat belum ada. Jalankan supabase/seed.sql terlebih dahulu.");

  const placeBySlug = new Map(places.map((place) => [place.slug, place]));
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
