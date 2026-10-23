<p align="center">
  <img src="public/wargakampus-mark.svg" alt="Logo WargaKampus" width="80" height="80" />
</p>

# WargaKampus

WargaKampus adalah peta komunitas warga kampus untuk mahasiswa **Institut Teknologi PLN, Jakarta Barat**. Temukan tempat makan, nongkrong, nugas, laundry, fotokopi, dan kebutuhan harian. Data awal dari OpenStreetMap, dirawat oleh mahasiswa, dengan pin peta dan linimasa seperti media sosial.

## Status

- **Mode demo** berjalan tanpa Supabase memakai 26 tempat dari OpenStreetMap dan konten contoh.
- **Mode Supabase** mengaktifkan autentikasi, ulasan, postingan, komentar, like, simpanan, laporan, dan panel admin.
- Cakupan saat ini: MVP Wajib Demo dari rancangan, ditambah simpanan dan laporan.
- **Baca publik, tulis dengan login.** Semua postingan berstatus `published` bisa dibaca tanpa login; like, komentar, simpan, dan membuat postingan memerlukan akun.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS v4
- Supabase Auth, Postgres, Row Level Security, Storage
- Leaflet + OpenStreetMap
- Zod, Lucide

## Menjalankan

```bash
cd wargakampus   # atau folder tempat project ini disimpan
npm install
npm run dev
```

Buka http://localhost:3000. Tanpa `.env.local`, aplikasi otomatis masuk mode demo.

Untuk menyambungkan database, ikuti [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

## Akun demo

Jalankan `npm run seed:demo` sekali. Akun yang dibuat:

| Role | Email | Password |
|---|---|---|
| Mahasiswa | `rania@wargakampus.demo` | `WargaKampus123!` |
| Pemilik usaha | `tini@wargakampus.demo` | `WargaKampus123!` |
| Admin | `admin@wargakampus.demo` | `WargaKampus123!` |

Seed juga membuat `dimas@wargakampus.demo` dan `sari@wargakampus.demo` sebagai kontributor tambahan. Seed mengisi dua tempat milik **Bu Tini** (pemilik usaha), dua tempat yang menunggu verifikasi untuk antrean admin, dua laporan, tiga audit log, serta **media untuk semua tempat** berupa banner, pricelist, dan dua foto usaha per tempat. Halaman `/masuk` menampilkan tombol **Login Cepat Akun Demo** yang membuka popup berisi tiga akun utama. Set `DEMO_LOGIN_ENABLED=false` di production.

## Script

```bash
npm run dev        # development server
npm run build      # production build
npm run lint       # ESLint
npm run typecheck  # TypeScript tanpa emit
npm run seed:demo  # seed akun dan konten demo ke Supabase
```

## Struktur penting

```
src/app/
  page.tsx                 landing page
  (app)/jelajah/           peta + filter + daftar tempat
  (app)/tempat/[slug]/     detail tempat, ulasan, simpan, laporan
  (app)/tempat/baru/       tambah tempat dengan pin
  (app)/linimasa/          feed, komentar, like, simpan
  (app)/simpan/            tempat dan postingan tersimpan
  (app)/profil/            profil, kontribusi, edit profil
  (app)/admin/             verifikasi, laporan, pengguna, audit log
  (auth)/masuk|daftar/     autentikasi Supabase
  setup/                   panduan Supabase
src/lib/
  data/                    query Supabase + fallback demo
  supabase/                client, server, middleware
  mock-data.ts             data demo
  seed-places.json         26 tempat dari OpenStreetMap
supabase/
  schema.sql               tabel, RLS, trigger, storage
  seed.sql                 kampus, kategori, tempat
scripts/
  seed-demo.mjs            akun dan konten demo
```

## Fitur MVP

- Login dan profil dengan peran mahasiswa, pemilik usaha, dan admin.
- Peta Leaflet dengan pin, filter kategori, harga, jarak, dan fasilitas.
- Detail tempat: rating, ulasan, fasilitas, jam buka, jarak, tombol arah, simpan, laporan.
- Media usaha: banner, pricelist, dan galeri foto; bisa diunggah dari form tempat atau halaman detail oleh pemilik usaha/admin.
- Tambah tempat dengan pin drop dan status menunggu verifikasi.
- Linimasa: kartu postingan, tag tempat, foto, like, komentar, simpan.
- Pencarian dan filter di peta.
- Panel admin: antrean verifikasi, laporan, pengguna, audit log.
- Profil: kontribusi, ulasan, edit profil.
- Mode demo dengan data OpenStreetMap.

## Data dan atribusi

Tempat berasal dari **OpenStreetMap contributors** (ODbL). Harga, fasilitas, rating, dan jam buka adalah perkiraan demo, bukan hasil verifikasi lapangan. Peta memakai Leaflet dan tile OpenStreetMap.

## Skill UI/UX yang dipakai

- `frontend-design` resmi Anthropic dipakai sebagai panduan desain lokal (tidak di-commit).
- `ux-ui-agent-skills` (plugin87, MIT) dipakai sebagai referensi desain lokal. Folder `tokens/`, `taste/`, `design-systems/`, dan sejenisnya sengaja tidak di-commit agar repo tetap ringan; yang di-commit adalah hasil penerapannya di `src/`.

## Deploy ke Vercel

Environment variables yang perlu diisi di Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` atau `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL=https://domain-vercel-anda`
- `DEMO_LOGIN_ENABLED=true` untuk mengaktifkan tombol **Login Cepat Akun Demo**

Jangan menaruh `SUPABASE_SECRET_KEY` di Vercel; key itu hanya untuk `npm run seed:demo` di lokal. Setelah mengubah environment variables, lakukan **Redeploy** karena variabel `NEXT_PUBLIC_*` dibaca saat build.

Tombol **Login Cepat Akun Demo** ada di `/masuk`, di bawah form login, dan membuka popup berisi tiga akun. Kalau tidak terlihat, pastikan deployment memakai commit terbaru dan `DEMO_LOGIN_ENABLED` bukan `false`.

## Batasan

- Unggah foto langsung ke Supabase Storage belum diimplementasikan; form memakai URL foto.
- Notifikasi, badge, klaim usaha, follow, PWA, pesan langsung, dan multi-kota belum masuk UI. Tabelnya sudah ada di schema untuk tahap berikutnya.
- Deployment Vercel tersedia; pastikan environment variables dan commit terbaru sudah di-deploy.
- Data OpenStreetMap tidak lengkap untuk semua kategori. Beberapa tempat mungkin belum punya harga atau jam buka terverifikasi.

## Langkah berikutnya

1. Buat project Supabase dan isi `.env.local`.
2. Jalankan `schema.sql`, `seed.sql`, dan `npm run seed:demo`.
3. Buat admin pertama lewat Authentication lalu update role.
4. Uji alur: daftar, cari tempat, simpan, tulis ulasan, buat postingan, verifikasi tempat.
5. Tambahkan upload foto ke Supabase Storage.
6. Deploy ke Vercel dan atur environment variables.
