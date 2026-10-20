"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/ui/form-message";
import { FieldLabel, Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function SignInForm({ isDemo }: { isDemo: boolean }) {
  const [state, formAction] = useActionState(signInAction, null);

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
        <FieldLabel htmlFor="signin-email">Email</FieldLabel>
        <Input
          id="signin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nama@kampus.ac.id"
        />
      </div>

      <div>
        <FieldLabel htmlFor="signin-password">Password</FieldLabel>
        <Input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          placeholder="Password"
        />
      </div>

      <FormMessage message={state?.message} ok={state?.ok} />

      <SubmitButton pendingLabel="Masuk..." className="w-full">
        Masuk
      </SubmitButton>

      <p className="text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-ink underline underline-offset-2">
          Daftar
        </Link>
      </p>
    </form>
  );
}
