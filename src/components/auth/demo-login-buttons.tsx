"use client";

import { useState, useTransition } from "react";
import { ArrowRight, GraduationCap, ShieldCheck, Store } from "lucide-react";
import { demoLoginAction, type DemoRole } from "@/app/actions/demo";
import { FormMessage } from "@/components/ui/form-message";
import { cn } from "@/lib/utils";

const accounts: Array<{
  role: DemoRole;
  label: string;
  name: string;
  icon: typeof GraduationCap;
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

export function DemoLoginButtons() {
  const [pendingRole, setPendingRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    <section aria-labelledby="demo-login-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="demo-login-title" className="font-display text-xl font-semibold">
            Masuk cepat sebagai demo
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Pilih peran untuk melihat tampilan mahasiswa, pemilik usaha, atau admin.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-muted">3 role</span>
      </div>

      <div className="mt-4 space-y-2">
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
                "flex w-full items-center gap-3 rounded-sm border border-line bg-surface px-3 py-3 text-left transition-colors",
                "hover:border-ink hover:bg-paper-deep/40 disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-paper-deep">
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

      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Akun demo hanya untuk presentasi. Set{" "}
        <span className="font-mono">DEMO_LOGIN_ENABLED=false</span> di production.
      </p>
    </section>
  );
}
