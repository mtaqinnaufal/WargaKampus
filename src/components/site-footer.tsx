import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper-deep/45">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-muted">
            Peta komunitas untuk mahasiswa ITPLN. Temukan tempat yang masuk akal, lalu
            bagikan pengalamanmu supaya yang lain tidak perlu menebak.
          </p>
          <p className="mt-4 font-mono text-[10px] text-muted">
            Dibuat untuk {SITE.campusName}, {SITE.city}.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">Jelajahi</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/jelajah" className="hover:text-ink">Peta tempat</Link></li>
            <li><Link href="/linimasa" className="hover:text-ink">Linimasa kampus</Link></li>
            <li><Link href="/simpan" className="hover:text-ink">Tempat tersimpan</Link></li>
            <li><Link href="/tempat/baru" className="hover:text-ink">Tambah tempat</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">Tentang data</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href={SITE.osmUrl} className="hover:text-ink" target="_blank" rel="noreferrer">
                {SITE.osmAttribution}
              </a>
            </li>
            <li><Link href="/setup" className="hover:text-ink">Panduan Supabase</Link></li>
            <li><Link href="/masuk" className="hover:text-ink">Masuk</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
