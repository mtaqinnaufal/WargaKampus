import { initPage, mainEl } from "../page-common.js";
import { SUPABASE_URL } from "../config.js";
import { buttonClass, badge } from "../components/ui.js";
import { icon, refreshIcons } from "../components/icons.js";
import { url } from "../config.js";

await initPage();

const configured = Boolean(SUPABASE_URL);
const envExample = `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...`;

mainEl().innerHTML = `<div class="container-page py-10 lg:py-14">
  <div class="max-w-[760px]">
    <div class="flex flex-wrap items-center gap-2">
      ${badge(configured ? "Supabase terdeteksi" : "Supabase belum terdeteksi", { variant: configured ? "verify" : "signal" })}
      <span class="font-mono text-[10px] text-muted">Panduan setup &middot; versi statis</span>
    </div>
    <h1 class="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl">Sambungkan Supabase.</h1>
    <p class="mt-4 text-base leading-relaxed text-ink-soft">Versi statis ini memakai Supabase langsung dari browser. Autentikasi, ulasan, postingan, simpanan, dan moderasi tersimpan di Supabase dan dijaga RLS.</p>

    <div class="mt-8 border border-line bg-surface p-5">
      <h2 class="font-display text-xl font-semibold">1. Isi konfigurasi publik</h2>
      <p class="mt-2 text-sm leading-relaxed text-ink-soft">Isi <span class="font-mono">js/config.js</span> dengan Project URL dan publishable key. <strong>Jangan</strong> menaruh secret/service role di sini.</p>
      <pre class="mt-3 overflow-x-auto rounded-sm border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-surface">${envExample}</pre>
    </div>

    <div class="mt-6 border border-line bg-surface p-5">
      <h2 class="font-display text-xl font-semibold">2. Jalankan schema dan migrasi</h2>
      <p class="mt-2 text-sm leading-relaxed text-ink-soft">Di SQL Editor Supabase, jalankan secara berurutan:</p>
      <div class="mt-3 space-y-2 font-mono text-xs">
        <p class="rounded-sm border border-line bg-paper-deep px-3 py-2">supabase/schema.sql</p>
        <p class="rounded-sm border border-line bg-paper-deep px-3 py-2">supabase/seed.sql</p>
        <p class="rounded-sm border border-line bg-paper-deep px-3 py-2">supabase/migrations/20261102_add_review_photos.sql</p>
        <p class="rounded-sm border border-line bg-paper-deep px-3 py-2">supabase/migrations/20261102_drop_unused_tables.sql</p>
      </div>
    </div>

    <div class="mt-6 border border-line bg-surface p-5">
      <h2 class="font-display text-xl font-semibold">3. Buat admin pertama</h2>
      <p class="mt-2 text-sm leading-relaxed text-ink-soft">Buat user di Authentication, lalu ubah role-nya:</p>
      <pre class="mt-3 overflow-x-auto rounded-sm border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-surface">update public.profiles set role = 'admin' where email = 'admin@kampus.ac.id';</pre>
    </div>

    <div class="mt-6 border border-line bg-surface p-5">
      <h2 class="font-display text-xl font-semibold">4. Jalankan di XAMPP</h2>
      <p class="mt-2 text-sm leading-relaxed text-ink-soft">Taruh folder ini sebagai docroot (BASE = ""), atau di subfolder lalu set <span class="font-mono">BASE</span> di <span class="font-mono">js/config.js</span> dan <span class="font-mono">RewriteBase</span> di <span class="font-mono">.htaccess</span>.</p>
      <pre class="mt-3 overflow-x-auto rounded-sm border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-surface">npm install
npm run build:css</pre>
    </div>

    <div class="mt-8 flex flex-wrap gap-3">
      <a href="${url("/jelajah")}" class="${buttonClass()}">Buka aplikasi ${icon("arrow-right", "h-4 w-4")}</a>
      <a href="https://supabase.com/docs/guides/auth" target="_blank" rel="noreferrer" class="${buttonClass({ variant: "outline" })}">Dokumentasi Supabase Auth</a>
    </div>
  </div>
</div>`;

refreshIcons();
