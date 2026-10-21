# WargaKampus + Supabase setup

Panduan ini menyambungkan aplikasi Next.js ke Supabase. Setelah selesai, autentikasi, ulasan, postingan, simpanan, dan moderasi admin akan tersimpan sungguhan. Tanpa Supabase, aplikasi tetap bisa dibuka dalam mode demo memakai data OpenStreetMap.

## 1. Buat project Supabase

1. Buka https://supabase.com/dashboard.
2. Klik **New project**.
3. Nama: `wargakampus`.
4. Region: **Southeast Asia (Singapore)** untuk latensi terbaik dari Indonesia.
5. Simpan database password di tempat aman.
6. Tunggu sampai project selesai provisioning.

## 2. Ambil URL dan key

Buka project Supabase, lalu:

1. Klik **Connect** di kanan atas. Dialog ini menampilkan **Project URL** dan **publishable key** siap salin.
2. Untuk melihat semua key, buka **Settings > API Keys**. Di dashboard terbaru, semua key ada di sini, baik key baru maupun key lama.

Supabase sekarang punya dua sistem key:

| Kebutuhan | Key baru (disarankan) | Key lama (masih berlaku sampai akhir 2026) |
|---|---|---|
| Browser / client | `publishable`, format `sb_publishable_...` | `anon`, format JWT panjang `eyJ...` |
| Server / seed script | `secret`, format `sb_secret_...` | `service_role`, format JWT panjang `eyJ...` |

Kalau project Anda masih hanya menampilkan key lama, Anda tetap bisa memakainya. Kalau ada tombol **Create new API keys**, Anda boleh membuat key baru; key lama tetap berjalan.

Buat file `.env.local` di folder project. Pilih salah satu format berikut.

**Format baru (disarankan):**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Format lama:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Aplikasi membaca kedua format. Kalau keduanya diisi, key baru yang dipakai.

**Penting:**

- `NEXT_PUBLIC_*` aman dipakai di browser. Jangan pernah menaruh `secret` atau `service_role` di variabel `NEXT_PUBLIC_*`.
- `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai `npm run seed:demo`. Aplikasi Next.js tidak mengirim key ini ke browser.
- Jangan commit `.env.local`.
- Kalau key bocor, hapus/rotate key dari **Settings > API Keys**.

## 3. Jalankan schema

Buka **SQL Editor** di Supabase, lalu jalankan isi:

```
supabase/schema.sql
```

Schema membuat:

- 19 tabel: profiles, campuses, places, reviews, posts, comments, likes, saves, reports, audit logs, dan lainnya.
- RLS untuk setiap tabel.
- Trigger profil otomatis saat user mendaftar.
- Trigger hitung like, komentar, dan rating tempat.
- Bucket storage `place-photos`, `post-photos`, dan `avatars`.

Setelah schema selesai, jalankan:

```
supabase/seed.sql
```

Seed berisi kampus ITPLN, 8 kategori, dan 26 tempat dari OpenStreetMap di sekitar kampus.

## 4. Atur autentikasi

Buka **Authentication > Providers > Email**.

Untuk pengembangan lokal, paling mudah mematikan **Confirm email** supaya akun bisa langsung masuk. Kalau tetap ingin konfirmasi email, buka tautan konfirmasi yang dikirim Supabase sebelum masuk.

Password minimal 8 karakter di form pendaftaran. Akun demo dari script seed sudah dikonfirmasi otomatis.

## 5. Buat admin pertama

1. Buka **Authentication > Users > Add user**.
2. Buat user dengan email dan password yang kamu ingat.
3. Buka **SQL Editor**, lalu jalankan:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@kampus.ac.id';
```

Ganti email sesuai akun admin. Setelah itu masuk ke aplikasi, menu **Admin** akan muncul di sidebar.

## 6. Seed konten demo

Script ini membuat empat akun demo, enam postingan, komentar, like, dan dua belas ulasan:

```bash
npm run seed:demo
```

Script memakai `SUPABASE_SECRET_KEY` atau `SUPABASE_SERVICE_ROLE_KEY` dari `.env.local`. Kalau tabel belum ada atau `seed.sql` belum dijalankan, script akan berhenti dengan pesan yang jelas.

Akun demo:

| Email | Nama | Peran |
|---|---|---|
| `admin@wargakampus.demo` | Admin WargaKampus | Admin |
| `rania@wargakampus.demo` | Rania Putri | Mahasiswa |
| `dimas@wargakampus.demo` | Dimas Arya | Mahasiswa |
| `sari@wargakampus.demo` | Sari Lestari | Mahasiswa |
| `tini@wargakampus.demo` | Bu Tini | Pemilik usaha |

Password semua akun demo: `WargaKampus123!`

Halaman `/masuk` punya tombol **Login Cepat Akun Demo** yang membuka popup berisi tiga akun utama. Set `DEMO_LOGIN_ENABLED=false` di production.

## 7. Jalankan aplikasi

```bash
npm run dev
```

Buka http://localhost:3000. Kalau `.env.local` terbaca, banner mode demo akan hilang dan aplikasi memakai Supabase.

## Migrasi akses publik postingan

Jika project Supabase sudah dibuat sebelum perubahan ini, jalankan file berikut di SQL Editor:

```
supabase/migrations/20261021_public_posts.sql
```

Migrasi ini membuat semua postingan berstatus `published` bisa dibaca tanpa login. Like, komentar, simpan, lapor, dan membuat postingan tetap memerlukan login.

## Catatan keamanan

- RLS aktif di semua tabel. Pengguna biasa hanya bisa menulis data miliknya sendiri.
- `profiles.email` tidak bisa dibaca lewat API publik. Email tetap tersimpan di `auth.users`.
- Trigger menolak perubahan `role`, `reputation_points`, `is_active`, dan `email` oleh non-admin.
- Trigger menolak perubahan status tempat oleh non-admin.
- Service role key hanya dipakai `scripts/seed-demo.mjs`. Jangan pernah memasukkannya ke komponen client.

## Troubleshooting

**`new row violates row-level security policy`**

Pastikan user sudah login dan mencoba menulis data dengan `user_id` atau `created_by` miliknya sendiri. Cek juga policy di Supabase Dashboard > Authentication > Policies.

**Tidak bisa membaca email profil**

Itu disengaja. Aplikasi mengambil email dari `auth.users`, bukan dari tabel `profiles`.

**Rating tempat tidak berubah setelah ulasan**

Pastikan trigger `place_reviews_sync_rating` ada. Jalankan ulang bagian trigger di `schema.sql` kalau perlu.

**Postingan tidak muncul di linimasa**

Cek `status = 'published'`. Setelah migrasi `20261021_public_posts.sql`, semua postingan published bisa dibaca publik. Kalau masih tidak muncul, cek policy `posts_read` dan jalankan `notify pgrst, 'reload schema';`.

**Upload foto belum jalan**

MVP memakai URL foto. Bucket storage sudah dibuat, tetapi form unggah langsung belum diimplementasikan. Tambahkan upload ke `place-photos` atau `post-photos` dengan folder `auth.uid()`.

**Data OpenStreetMap perlu diperbarui**

`seed.sql` dihasilkan dari data OpenStreetMap di sekitar ITPLN. Harga, fasilitas, dan rating adalah perkiraan demo, bukan fakta terverifikasi. Perbarui lewat aplikasi atau query Overpass baru.

## Atribusi

Data tempat berasal dari OpenStreetMap contributors, ODbL:
https://www.openstreetmap.org/copyright

Peta memakai Leaflet dan tile OpenStreetMap.
