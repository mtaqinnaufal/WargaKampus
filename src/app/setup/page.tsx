import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Database, KeyRound, Terminal } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Panduan Supabase",
  description: "Langkah menyambungkan KosPintar ke Supabase.",
};

const envExample = `NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Format lama masih bisa:
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...`;

const adminSql = `update public.profiles
set role = 'admin'
where email = 'admin@kampus.ac.id';`;

export default async function SetupPage() {
  const current = await getCurrentUser();

  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader profile={current.profile} isDemo={current.isDemo} />

      <main id="main" className="container-page py-10 lg:py-14">
        <div className="max-w-[760px]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isSupabaseConfigured ? "verify" : "signal"}>
              {isSupabaseConfigured ? "Supabase terdeteksi" : "Supabase belum terdeteksi"}
            </Badge>
            <span className="font-mono text-[10px] text-muted">Panduan setup</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl">
            Sambungkan Supabase.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Aplikasi ini berjalan dalam mode demo memakai data OpenStreetMap. Setelah Supabase
            tersambung, autentikasi, ulasan, postingan, simpanan, dan moderasi admin akan
            tersimpan sungguhan.
          </p>

          <div className="mt-8 border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Database className="h-4 w-4" aria-hidden="true" />
              1. Buat project Supabase
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
              <li>
                Buka{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-2"
                >
                  supabase.com/dashboard
                </a>{" "}
                dan buat project baru.
              </li>
              <li>Nama project: <span className="font-mono text-xs">kospintar</span>.</li>
              <li>Region terdekat: Singapore.</li>
              <li>Simpan database password di tempat aman.</li>
            </ol>
          </div>

          <div className="mt-6 border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              2. Isi .env.local
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Buka <strong>Connect</strong> untuk menyalin Project URL dan publishable key. Semua
              key juga ada di <strong>Settings &gt; API Keys</strong>. Project lama mungkin masih
              memakai anon dan service_role; keduanya masih didukung aplikasi ini.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-sm border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-surface">
              {envExample}
            </pre>
            <p className="mt-2 text-xs text-muted">
              Jangan commit <span className="font-mono">.env.local</span>. Secret/service_role
              hanya untuk script seed di server, bukan untuk browser.
            </p>
          </div>

          <div className="mt-6 border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              3. Jalankan schema dan seed
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Buka SQL Editor di Supabase. Jalankan file secara berurutan:
            </p>
            <div className="mt-3 space-y-2 font-mono text-xs">
              <p className="rounded-sm border border-line bg-paper-deep px-3 py-2">
                supabase/schema.sql
              </p>
              <p className="rounded-sm border border-line bg-paper-deep px-3 py-2">
                supabase/seed.sql
              </p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Seed berisi kampus ITPLN, kategori, dan 26 tempat dari OpenStreetMap. Harga,
              fasilitas, dan rating adalah perkiraan demo.
            </p>
          </div>

          <div className="mt-6 border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              4. Buat admin
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Buat user lewat Authentication &gt; Users, lalu jalankan SQL berikut di SQL Editor
              dengan email admin kamu.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-sm border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-surface">
              {adminSql}
            </pre>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Setelah role admin, masuk ke aplikasi dan buka menu Admin di sidebar.
            </p>
          </div>

          <div className="mt-6 border border-line bg-surface p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              5. Seed akun dan konten demo
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Script ini membuat akun demo, postingan, komentar, like, dan ulasan agar linimasa
              tidak kosong.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-sm border border-line bg-ink p-4 font-mono text-xs leading-relaxed text-surface">
              npm run seed:demo
            </pre>
            <p className="mt-2 text-xs text-muted">
              Script memakai service role key dari .env.local. Akun demo memakai password yang
              tertulis di README.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/jelajah" className={buttonClass({ variant: "primary", size: "md" })}>
              Buka aplikasi
            </Link>
            <a
              href="https://supabase.com/docs/guides/auth"
              target="_blank"
              rel="noreferrer"
              className={buttonClass({ variant: "outline", size: "md" })}
            >
              Dokumentasi Supabase Auth
            </a>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted">
            Detail lengkap ada di <span className="font-mono">SUPABASE_SETUP.md</span> dan{" "}
            <span className="font-mono">README.md</span> di folder project. Kalau ada error
            permission, jalankan ulang bagian grant di schema atau cek RLS di dashboard.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
