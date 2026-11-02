# WargaKampus — Static (HTML + CSS + JS)

Versi statis dari WargaKampus: **HTML + CSS + JS murni (tanpa PHP, tanpa SSR)**, dengan
**Supabase** sebagai backend yang diakses **langsung dari browser** (publishable/anon key +
Row Level Security).

Proyek Next.js aslinya ada di `../kospintar/` dan tidak diubah.

## Struktur

```
index.html                 landing
jelajah/ linimasa/ simpan/ profil/ admin/ masuk/ daftar/ setup/   masing-masing index.html
tempat/index.html          detail tempat (baca ?slug=)
tempat/baru/index.html     tambah tempat
auth/callback/ signout/    halaman bantu auth
css/input.css              sumber Tailwind  → build → css/styles.css
js/config.js               konfigurasi publik (URL + publishable key)
js/api/*   js/actions/*    baca/tulis ke Supabase
js/components/*  js/pages/*  render & logic halaman
vendor/                    supabase-js, leaflet (offline)
assets/                    logo, gambar demo
```

## Setup

1. Node.js (untuk build CSS):
   ```bash
   npm install
   npm run build:css      # hasilkan css/styles.css
   ```
   Saat mengembangkan: `npm run watch:css`.

2. Konfigurasi kredensial: salin `js/config.local.example.js` menjadi `js/config.local.js`
   lalu isi `SUPABASE_URL`, `SUPABASE_ANON_KEY`, dan `BASE`. File `js/config.local.js`
   **diabaikan Git** (lihat `.gitignore`) sehingga tidak ikut ter-push.
   **Jangan** pernah menaruh `SUPABASE_SECRET_KEY` / service role di proyek ini.

3. Jalankan di XAMPP/Apache:
   - Paling mudah: taruh folder ini sebagai docroot (atau virtual host) sehingga URL
     root-relatif (`/css/styles.css`) bekerja, dan biarkan `BASE = ""`.
   - Jika ditaruh di subfolder `htdocs/wargakampus-static/`, set `BASE = "/wargakampus-static"`
     dan sesuaikan `RewriteBase` di `.htaccess`.

4. Buka `http://localhost/` (atau `http://localhost/wargakampus-static/`).

## Keamanan

- Hanya publishable/anon key yang boleh ada di kode browser.
- Otorisasi sepenuhnya bergantung pada **RLS** di Supabase. Audit policy sebelum deploy.
- Unggah foto langsung dari browser ke Supabase Storage (folder `auth.uid()`).

## Sumber data

Data tempat berasal dari OpenStreetMap contributors (ODbL). Peta memakai Leaflet + tile OSM.
