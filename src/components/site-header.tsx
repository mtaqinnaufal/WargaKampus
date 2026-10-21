import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { SITE } from "@/lib/constants";
import type { Profile } from "@/lib/types";

export function SiteHeader({
  profile,
  isDemo,
}: {
  profile: Profile | null;
  isDemo: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <BrandMark />
          <span className="hidden border-l border-line pl-5 font-mono text-[10px] leading-tight text-muted md:block">
            {SITE.campusShort}
            <br />
            {SITE.city}
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          <Link href="/jelajah" className="rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep">
            Jelajah
          </Link>
          <Link href="/linimasa" className="rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep">
            Linimasa
          </Link>
          <Link href="/simpan" className="rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep">
            Simpan
          </Link>
          <Link href="/profil" className="rounded-sm px-3 py-2 text-sm text-ink-soft hover:bg-paper-deep">
            Profil
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isDemo ? (
            <Badge variant="signal" className="hidden sm:inline-flex">
              Mode demo
            </Badge>
          ) : null}
          {profile ? (
            <>
              <Link href="/profil" className="hidden items-center gap-2 sm:flex">
                <Avatar name={profile.name} src={profile.avatar_url} size="sm" decorative />
                <span className="max-w-28 truncate text-sm font-medium">{profile.name}</span>
              </Link>
              <Link
                href="/tempat/baru"
                className={buttonClass({ variant: "primary", size: "sm" })}
              >
                Tambah tempat
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className="hidden rounded-sm px-3 py-2 text-sm font-medium text-ink hover:bg-paper-deep sm:block"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className={buttonClass({ variant: "primary", size: "sm" })}
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>

      <nav
        className="border-t border-line px-4 py-2 md:hidden"
        aria-label="Navigasi utama seluler"
      >
        <div className="flex items-center gap-1">
          {[
            { href: "/jelajah", label: "Jelajah" },
            { href: "/linimasa", label: "Linimasa" },
            { href: "/simpan", label: "Simpan" },
            { href: "/profil", label: "Profil" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 rounded-sm px-2 py-2 text-center text-xs text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
