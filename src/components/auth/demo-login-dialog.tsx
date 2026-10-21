"use client";

import type { MouseEvent } from "react";
import { useRef, useState, useTransition } from "react";
import {
  ArrowRight,
  GraduationCap,
  KeyRound,
  ShieldCheck,
  Store,
  X,
  type LucideIcon,
} from "lucide-react";
import { demoLoginAction, type DemoRole } from "@/app/actions/demo";
import { FormMessage } from "@/components/ui/form-message";
import { cn } from "@/lib/utils";

const accounts: Array<{
  role: DemoRole;
  label: string;
  name: string;
  icon: LucideIcon;
}> = [
  {
    role: "mahasiswa",
    label: "Mahasiswa",
    name: "Rania Putri",
    icon: GraduationCap,
  },
  {
    role: "pemilik",
    label: "Pemilik usaha",
    name: "Bu Tini",
    icon: Store,
  },
  {
    role: "admin",
    label: "Admin",
    name: "Admin WargaKampus",
    icon: ShieldCheck,
  },
];

export function DemoLoginDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pendingRole, setPendingRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  function handleClose() {
    setError(null);
    setPendingRole(null);
  }

  function handleLogin(role: DemoRole) {
    setError(null);
    setPendingRole(role);

    startTransition(async () => {
      const result = await demoLoginAction(role);
      if (!result.ok) {
        setError(result.message ?? "Gagal masuk sebagai akun demo.");
        setPendingRole(null);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="flex w-full items-center gap-3 rounded-sm border border-ink bg-surface px-4 py-3 text-left transition-colors hover:bg-paper-deep/40"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-ink bg-signal">
          <KeyRound className="h-4 w-4 text-ink" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">Login Cepat Akun Demo</span>
          <span className="block text-xs text-muted">Mahasiswa, pemilik usaha, admin</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
      </button>

      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        Untuk presentasi. Set <span className="font-mono">DEMO_LOGIN_ENABLED=false</span> di production.
      </p>

      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onClose={handleClose}
        aria-labelledby="demo-dialog-title"
        aria-describedby="demo-dialog-description"
        className="demo-dialog m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-md border border-ink bg-surface p-0 text-ink shadow-lift"
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] text-muted">Akun demo</p>
              <h2
                id="demo-dialog-title"
                className="mt-1 font-display text-2xl font-semibold leading-tight"
              >
                Pilih role untuk masuk cepat.
              </h2>
              <p id="demo-dialog-description" className="mt-1 text-sm leading-relaxed text-muted">
                Tiga akun ini hanya untuk presentasi.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Tutup dialog akun demo"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line text-muted transition-colors hover:bg-paper-deep hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {accounts.map((account) => {
              const Icon = account.icon;
              const isCurrent = pendingRole === account.role && isPending;

              return (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleLogin(account.role)}
                  disabled={isPending}
                  aria-busy={isCurrent || undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-sm border border-line bg-paper/40 px-3 py-3 text-left transition-colors",
                    "hover:border-ink hover:bg-paper-deep/50 disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-surface">
                    <Icon className="h-4 w-4 text-ink" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{account.label}</span>
                    <span className="block text-xs text-muted">{account.name}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink">
                    {isCurrent ? "Masuk..." : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  </span>
                </button>
              );
            })}
          </div>

          <FormMessage message={error} className="mt-3" />

          <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-muted">
            Password demo: <span className="font-mono">WargaKampus123!</span>. Set{" "}
            <span className="font-mono">DEMO_LOGIN_ENABLED=false</span> di production.
          </p>
        </div>
      </dialog>
    </>
  );
}
