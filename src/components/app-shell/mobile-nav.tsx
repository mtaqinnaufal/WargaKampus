"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Map, Newspaper, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/jelajah", label: "Jelajah", icon: Map },
  { href: "/linimasa", label: "Linimasa", icon: Newspaper },
  { href: "/tempat/baru", label: "Tambah", icon: Plus, accent: true },
  { href: "/simpan", label: "Simpan", icon: Bookmark },
  { href: "/profil", label: "Profil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navigasi utama"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] transition-colors",
                  active ? "text-ink" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-sm",
                    item.accent
                      ? "border border-ink bg-signal text-ink"
                      : active
                        ? "bg-paper-deep text-ink"
                        : "text-muted",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
