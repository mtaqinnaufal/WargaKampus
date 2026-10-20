import Link from "next/link";
import { Plus } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { NavLinks } from "@/components/app-shell/nav-links";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/constants";
import type { Campus, Profile } from "@/lib/types";

export function AppSidebar({
  profile,
  campus,
  isDemo,
}: {
  profile: Profile | null;
  campus: Campus;
  isDemo: boolean;
}) {
  return (
    <aside
      aria-label="Sidebar aplikasi"
      className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-line bg-paper lg:flex"
    >
      <div className="border-b border-line px-5 py-5">
        <BrandMark />
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted">
          {campus.name}
          <br />
          {campus.city}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigasi aplikasi">
        <NavLinks variant="sidebar" isAdmin={profile?.role === "admin"} />

        <div className="mt-6 px-1">
          <Link
            href="/tempat/baru"
            className={buttonClass({ variant: "primary", size: "md", className: "w-full" })}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah tempat
          </Link>
        </div>

        {isDemo ? (
          <div className="mt-4 px-1">
            <Badge variant="signal">Mode demo</Badge>
          </div>
        ) : null}
      </nav>

      <div className="border-t border-line p-4">
        {profile ? (
          <div className="flex items-center gap-3">
            <Avatar name={profile.name} src={profile.avatar_url} size="sm" decorative />
            <div className="min-w-0 flex-1">
              <Link href="/profil" className="block truncate text-sm font-medium hover:underline">
                {profile.name}
              </Link>
              <p className="text-xs text-muted">{ROLE_LABELS[profile.role]}</p>
            </div>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-xs text-muted transition-colors hover:text-ink">
                Keluar
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/masuk"
            className={buttonClass({ variant: "outline", size: "sm", className: "w-full" })}
          >
            Masuk
          </Link>
        )}
      </div>
    </aside>
  );
}
