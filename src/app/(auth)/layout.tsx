import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { SITE } from "@/lib/constants";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-paper lg:grid-cols-[1.05fr_0.95fr]">
      <aside
        aria-label="Tentang WargaKampus"
        className="relative hidden overflow-hidden bg-ink p-10 text-surface lg:flex lg:flex-col lg:justify-between"
      >
        <div className="grid-paper absolute inset-0 opacity-[0.1]" aria-hidden="true" />

        <div className="relative">
          <BrandMark tone="light" />
          <h1 className="mt-16 max-w-[12ch] font-display text-5xl font-bold leading-[0.94] tracking-[-0.05em]">
            Tempat yang masuk akal, dari mahasiswa.
          </h1>
          <p className="mt-6 max-w-[44ch] text-sm leading-relaxed text-surface/70">
            WargaKampus mengumpulkan info makan, nugas, nongkrong, laundry, dan kebutuhan harian
            di sekitar kampus. Bukan iklan, bukan daftar tempat yang tidak pernah dicek.
          </p>
        </div>

        <div className="relative">
          <ul className="space-y-3 border-t border-surface/20 pt-5 text-sm text-surface/70">
            <li>Data awal dari OpenStreetMap, dirawat komunitas.</li>
            <li>Setiap tempat baru dicek admin sebelum tampil.</li>
            <li>Fokus di sekitar {SITE.campusShort}, {SITE.city}.</li>
          </ul>
          <p className="mt-6 font-mono text-[10px] text-surface/70">{SITE.osmAttribution}</p>
        </div>
      </aside>

      <main className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:hidden">
          <BrandMark />
          <Link href="/" className="text-sm font-medium text-muted">
            Beranda
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
