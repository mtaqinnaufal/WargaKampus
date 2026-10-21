"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, House, Map, Newspaper, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const baseItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/jelajah", label: "Jelajah", icon: Map },
  { href: "/linimasa", label: "Linimasa", icon: Newspaper },
  { href: "/simpan", label: "Simpan", icon: Bookmark },
  { href: "/profil", label: "Profil", icon: User },
];

export function NavLinks({
  variant = "top",
  isAdmin = false,
}: {
  variant?: "top" | "sidebar" | "mobile";
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...baseItems, { href: "/admin", label: "Admin", icon: ShieldCheck }]
    : baseItems;

  return (
    <ul
      className={
        variant === "sidebar"
          ? "space-y-1"
          : variant === "mobile"
            ? "flex items-stretch gap-1"
            : "flex items-center gap-1"
      }
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <li
            key={item.href}
            className={variant === "mobile" ? "min-w-0 flex-1" : undefined}
          >
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-sm text-sm transition-colors",
                variant === "sidebar"
                  ? "px-3 py-2.5"
                  : variant === "mobile"
                    ? "w-full flex-col justify-center gap-1 px-1 py-2 text-[11px]"
                    : "px-3 py-2",
                active
                  ? variant === "sidebar"
                    ? "bg-ink text-surface"
                    : "bg-signal text-ink"
                  : "text-muted hover:bg-paper-deep hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
