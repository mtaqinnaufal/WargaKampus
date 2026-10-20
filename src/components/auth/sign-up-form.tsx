"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/ui/form-message";
import { FieldHint, FieldLabel, Input, Select } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Campus } from "@/lib/types";

export function SignUpForm({
  campuses,
  isDemo,
}: {
  campuses: Campus[];
  isDemo: boolean;
}) {
  const [state, formAction] = useActionState(signUpAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {isDemo ? (
        <div className="border border-signal bg-signal/20 px-3 py-2 text-sm leading-relaxed text-ink" role="status">
          Mode demo belum punya autentikasi. Kamu bisa langsung{" "}
          <Link href="/jelajah" className="font-semibold underline underline-offset-2">
            membuka peta
          </Link>
          .
        </div>
      ) : null}

      <div>
        <FieldLabel htmlFor="signup-name">Nama</FieldLabel>
        <Input
          id="signup-name"
          name="name"
          autoComplete="name"
          required
          placeholder="Nama yang dipakai di komunitas"
        />
      </div>

      <div>
        <FieldLabel htmlFor="signup-email">Email</FieldLabel>
        <Input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nama@kampus.ac.id"
        />
      </div>

      <div>
        <FieldLabel htmlFor="signup-password">Password</FieldLabel>
        <Input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Minimal 8 karakter"
        />
        <FieldHint>Gunakan password yang tidak dipakai di akun lain.</FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="signup-campus">Kampus</FieldLabel>
        <Select id="signup-campus" name="campus_id" defaultValue={campuses[0]?.id ?? ""}>
          {campuses.map((campus) => (
            <option key={campus.id} value={campus.id}>
              {campus.name} · {campus.city}
            </option>
          ))}
        </Select>
      </div>

      <FormMessage message={state?.message} ok={state?.ok} />

      <SubmitButton pendingLabel="Membuat akun..." className="w-full">
        Buat akun
      </SubmitButton>

      <p className="text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-ink underline underline-offset-2">
          Masuk
        </Link>
      </p>
    </form>
  );
}
