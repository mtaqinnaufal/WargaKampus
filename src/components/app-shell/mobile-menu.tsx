"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Plus, X } from "lucide-react";
import { NavLinks } from "@/components/app-shell/nav-links";
import { buttonClass } from "@/components/ui/button";

export function MobileMenu({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="grid h-10 w-10 place-items-center rounded-sm border border-line bg-surface text-ink transition-colors hover:bg-paper-deep"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          id="mobile-site-menu"
          onClickCapture={() => setOpen(false)}
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-line bg-surface p-3 shadow-lift"
        >
          <nav aria-label="Navigasi utama seluler">
            <NavLinks variant="sidebar" isAdmin={isAdmin} />
          </nav>
          <Link
            href="/tempat/baru"
            className={buttonClass({
              variant: "primary",
              size: "md",
              className: "mt-3 w-full",
            })}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tambah tempat
          </Link>
        </div>
      ) : null}
    </div>
  );
}
