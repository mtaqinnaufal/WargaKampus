import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { NavLinks } from "@/components/app-shell/nav-links";
import { MobileMenu } from "@/components/app-shell/mobile-menu";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import type { Campus, Profile } from "@/lib/types";

export function AppTopBar({
  profile,
  campus,
  isDemo = false,
}: {
  profile: Profile | null;
  campus: Campus;
  isDemo?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <BrandMark />
          <span className="hidden border-l border-line pl-4 font-mono text-[10px] leading-tight text-muted xl:block">
            {campus.name}
            <br />
            {campus.city}
          </span>
        </div>

        <nav className="hidden lg:block" aria-label="Navigasi utama">
          <NavLinks variant="top" isAdmin={profile?.role === "admin"} />
        </nav>

        <div className="flex items-center gap-2">
          {isDemo ? (
            <Badge variant="signal" className="hidden sm:inline-flex">
              Mode demo
            </Badge>
          ) : null}
          <Link
            href="/tempat/baru"
            className={buttonClass({
              variant: "primary",
              size: "sm",
              className: "hidden xl:inline-flex",
            })}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah tempat
          </Link>
          <Link
            href="/tempat/baru"
            aria-label="Tambah tempat"
            className="grid h-10 w-10 place-items-center rounded-sm border border-ink bg-signal text-ink xl:hidden"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Link>

          {profile ? (
            <details className="relative">
              <summary
                aria-label={`Menu akun ${profile.name}`}
                className="flex cursor-pointer list-none items-center gap-2 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-paper-deep [&::-webkit-details-marker]:hidden"
              >
                <Avatar
                  name={profile.name}
                  src={profile.avatar_url}
                  size="sm"
                  decorative
                />
                <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                  {profile.name}
                </span>
                <ChevronDown
                  className="hidden h-3.5 w-3.5 text-muted sm:block"
                  aria-hidden="true"
                />
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-sm border border-line bg-surface p-1 shadow-lift">
                <Link
                  href="/profil"
                  className="block rounded-sm px-3 py-2 text-sm text-ink hover:bg-paper-deep"
                >
                  Profil
                </Link>
                {profile.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="block rounded-sm px-3 py-2 text-sm text-ink hover:bg-paper-deep"
                  >
                    Admin
                  </Link>
                ) : null}
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-sm px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-paper-deep hover:text-ink"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link href="/masuk" className="px-2 text-sm font-semibold text-ink">
              Masuk
            </Link>
          )}

          <MobileMenu isAdmin={profile?.role === "admin"} />
        </div>
      </div>
    </header>
  );
}
