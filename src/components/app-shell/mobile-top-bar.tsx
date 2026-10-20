import Link from "next/link";
import { Plus } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Avatar } from "@/components/ui/avatar";
import type { Campus, Profile } from "@/lib/types";

export function MobileTopBar({
  profile,
  campus,
}: {
  profile: Profile | null;
  campus: Campus;
  isDemo: boolean;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <BrandMark />
          <p className="mt-1 truncate font-mono text-[10px] text-muted">
            {campus.city} · {campus.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tempat/baru"
            aria-label="Tambah tempat"
            className="grid h-10 w-10 place-items-center rounded-sm border border-ink bg-signal text-ink"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Link>
          {profile ? (
            <Link href="/profil" aria-label="Buka profil">
              <Avatar name={profile.name} src={profile.avatar_url} size="sm" decorative />
            </Link>
          ) : (
            <Link href="/masuk" className="text-sm font-semibold text-ink">
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
