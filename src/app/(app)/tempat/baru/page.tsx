import type { Metadata } from "next";
import Link from "next/link";
import { AddPlaceForm } from "@/components/places/add-place-form";
import { getCurrentUser } from "@/lib/auth";
import { getDefaultCampus } from "@/lib/data/campuses";
import { getCategories } from "@/lib/data/places";

export const metadata: Metadata = {
  title: "Tambah tempat",
  description: "Tambahkan tempat makan, nongkrong, laundry, atau kebutuhan harian di sekitar ITPLN.",
};

export default async function NewPlacePage() {
  const [current, categories, campus] = await Promise.all([
    getCurrentUser(),
    getCategories(),
    getDefaultCampus(),
  ]);

  return (
    <div className="container-page py-6 lg:py-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
        <Link href="/jelajah" className="hover:text-ink">Jelajah</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">Tambah tempat</span>
      </nav>

      <header className="mt-4 border-b border-line pb-6">
        <h1 className="max-w-[20ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
          Tambah tempat yang belum ada di peta.
        </h1>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">
          Isi informasi yang kamu tahu. Setelah dikirim, admin akan mengecek sebelum tempat tampil
          untuk semua mahasiswa.
        </p>
      </header>

      <div className="mt-8">
        <AddPlaceForm categories={categories} campus={campus} isDemo={current.isDemo} />
      </div>
    </div>
  );
}
