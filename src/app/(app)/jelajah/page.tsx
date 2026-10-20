import type { Metadata } from "next";
import { ExploreClient } from "@/components/explore/explore-client";
import { getCurrentUser } from "@/lib/auth";
import { getDefaultCampus } from "@/lib/data/campuses";
import { getCategories, getPlaces } from "@/lib/data/places";

export const metadata: Metadata = {
  title: "Jelajah tempat",
  description:
    "Cari tempat makan, nongkrong, nugas, laundry, fotokopi, dan kebutuhan harian di sekitar ITPLN.",
};

export default async function JelajahPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  const params = await searchParams;
  const [current, campus, places, categories] = await Promise.all([
    getCurrentUser(),
    getDefaultCampus(),
    getPlaces(),
    getCategories(),
  ]);

  return (
    <ExploreClient
      places={places}
      categories={categories}
      campus={campus}
      initialQuery={params.q ?? ""}
      initialCategory={params.kategori ?? "semua"}
      isDemo={current.isDemo}
    />
  );
}
