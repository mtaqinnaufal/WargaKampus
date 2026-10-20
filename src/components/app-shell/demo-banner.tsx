import Link from "next/link";
import { Info } from "lucide-react";

export function DemoBanner({ isDemo }: { isDemo: boolean }) {
  if (!isDemo) return null;

  return (
    <div role="status" className="border-b border-ink/20 bg-signal text-ink">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Mode demo: data contoh dari OpenStreetMap. Perubahan belum disimpan.
        </p>
        <Link href="/setup" className="font-semibold underline underline-offset-2">
          Panduan Supabase
        </Link>
      </div>
    </div>
  );
}
