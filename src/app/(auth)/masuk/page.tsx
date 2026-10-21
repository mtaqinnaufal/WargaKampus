import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke WargaKampus untuk menyimpan tempat dan berbagi pengalaman.",
};

export default async function SignInPage() {
  const current = await getCurrentUser();
  if (current.profile && !current.isDemo) redirect("/jelajah");

  return (
    <div>
      <p className="font-mono text-[11px] text-muted">Selamat datang kembali</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight">Masuk ke WargaKampus.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Simpan tempat, tulis ulasan, dan ikut menjaga info tetap akurat.
      </p>

      <div className="mt-7">
        <SignInForm isDemo={current.isDemo} />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Dengan masuk, kamu setuju untuk tidak membagikan data pribadi orang lain dan tidak
        mengirim spam.{" "}
        <Link href="/setup" className="underline underline-offset-2">
          Panduan komunitas dan setup
        </Link>
        .
      </p>
    </div>
  );
}
