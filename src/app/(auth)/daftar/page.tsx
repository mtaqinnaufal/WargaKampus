import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/auth";
import { getCampuses } from "@/lib/data/campuses";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun WargaKampus untuk berbagi info tempat di sekitar kampus.",
};

export default async function SignUpPage() {
  const [current, campuses] = await Promise.all([getCurrentUser(), getCampuses()]);
  if (current.profile && !current.isDemo) redirect("/jelajah");

  return (
    <div>
      <p className="font-mono text-[11px] text-muted">Akun komunitas</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight">Daftar WargaKampus.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Pakai nama yang kamu nyaman dilihat orang lain. Email hanya dipakai untuk akun.
      </p>

      <div className="mt-7">
        <SignUpForm campuses={campuses} isDemo={current.isDemo} />
      </div>
    </div>
  );
}
