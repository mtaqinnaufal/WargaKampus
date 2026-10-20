import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { CategoryArt } from "@/components/category-art";
import { PlaceMap } from "@/components/map/place-map";
import { ReportPlaceForm, SavePlaceButton } from "@/components/places/place-actions";
import { ReviewForm } from "@/components/places/review-form";
import { CategoryIcon } from "@/components/category-icon";
import { StatusBadge } from "@/components/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StarRating } from "@/components/ui/star-rating";
import { getCurrentUser } from "@/lib/auth";
import { getPlaceBySlug, getPlaceReviews, isPlaceSaved } from "@/lib/data/places";
import { SITE } from "@/lib/constants";
import type { Place } from "@/lib/types";
import {
  formatDistance,
  formatPriceRange,
  relativeTime,
} from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place) return { title: "Tempat tidak ditemukan" };

  return {
    title: place.name,
    description: place.description.slice(0, 160),
  };
}

function sourceNote(place: Place) {
  if (place.source === "osm") {
    return "Data awal berasal dari OpenStreetMap. Harga, fasilitas, dan jam buka adalah perkiraan yang perlu diverifikasi komunitas.";
  }
  if (place.source === "user") {
    return "Tempat ini ditambahkan oleh komunitas. Data menunggu verifikasi admin sebelum tampil untuk semua orang.";
  }
  return "Data contoh untuk mode demo.";
}

export default async function PlacePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { slug } = await params;
  await searchParams;

  const [current, place] = await Promise.all([getCurrentUser(), getPlaceBySlug(slug)]);
  if (!place) notFound();

  const canSee =
    place.status === "verified" ||
    current.profile?.role === "admin" ||
    current.profile?.id === place.created_by;

  if (!canSee) notFound();

  const [reviews, saved] = await Promise.all([
    getPlaceReviews(place.id),
    current.profile ? isPlaceSaved(current.profile.id, place.id) : Promise.resolve(false),
  ]);

  const directionsUrl = `https://www.openstreetmap.org/directions?from=&to=${place.latitude}%2C${place.longitude}`;
  const isPending = place.status === "pending";

  return (
    <div className="container-page py-6 lg:py-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <Link href="/jelajah" className="hover:text-ink">Jelajah</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/jelajah?kategori=${place.category.slug}`} className="hover:text-ink">
          {place.category.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{place.name}</span>
      </nav>

      {isPending ? (
        <div className="mt-4 border border-signal bg-signal/20 px-3 py-2 text-sm text-ink" role="status">
          Tempat ini masih menunggu verifikasi admin. Hanya kamu dan admin yang bisa melihatnya.
        </div>
      ) : null}

      <header className="mt-5 grid gap-6 border-b border-line pb-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <CategoryIcon slug={place.category.slug} className="h-3.5 w-3.5" />
              {place.category.name}
            </Badge>
            <StatusBadge status={place.status} />
            {place.source === "osm" ? <Badge variant="neutral">OpenStreetMap</Badge> : null}
          </div>

          <h1 className="mt-3 max-w-[20ch] font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl">
            {place.name}
          </h1>

          <p className="mt-3 flex items-start gap-2 text-sm text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {place.address}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <StarRating rating={place.rating_avg} count={place.review_count} />
            <span className="text-sm text-ink-soft">
              {formatPriceRange(place.price_min, place.price_max)}
            </span>
            <span className="text-sm text-muted">{formatDistance(place.distance_km)} dari kampus</span>
            <span className="text-sm text-muted">
              {place.open_hours.note ?? "Jam buka belum diverifikasi"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-2 lg:justify-end">
          <SavePlaceButton placeId={place.id} initialSaved={saved} />
          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClass({ variant: "primary", size: "md" })}
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Arah
          </a>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <CategoryArt
            slug={place.category.slug}
            name={place.category.name}
            className="h-48"
            label="Foto komunitas menyusul. Data awal dari OpenStreetMap."
          />

          <section className="mt-8" aria-labelledby="about-title">
            <h2 id="about-title" className="font-display text-2xl font-semibold">
              Tentang tempat
            </h2>
            <p className="prose-kp mt-3 max-w-[68ch] text-[15px] leading-relaxed text-ink-soft">
              {place.description}
            </p>

            {place.facilities.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {place.facilities.map((facility) => (
                  <Badge key={facility} variant="outline">
                    {facility}
                  </Badge>
                ))}
              </div>
            ) : null}
          </section>

          <section className="mt-10" aria-labelledby="reviews-title">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
              <h2 id="reviews-title" className="font-display text-2xl font-semibold">
                Kata mahasiswa
              </h2>
              <span className="font-mono text-[11px] text-muted">
                {reviews.length} ulasan
              </span>
            </div>

            {reviews.length > 0 ? (
              <div>
                {reviews.map((review) => (
                  <article key={review.id} className="border-b border-line py-5">
                    <div className="flex gap-3">
                      <Avatar
                        name={review.author.name}
                        src={review.author.avatar_url}
                        size="sm"
                        decorative
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-medium text-ink">
                            {review.author.name}
                          </span>
                          <StarRating rating={review.rating} showCount={false} />
                          <time
                            dateTime={review.created_at}
                            className="text-xs text-muted"
                            suppressHydrationWarning
                          >
                            {relativeTime(review.created_at)}
                          </time>
                        </div>
                        {review.body ? (
                          <p className="prose-kp mt-2 text-sm leading-relaxed text-ink-soft">
                            {review.body}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Belum ada ulasan"
                description="Kalau kamu sudah pernah datang, tulis hal yang paling berguna: harga, porsi, suasana, atau jam ramai."
                className="mt-5"
              />
            )}

            {current.profile ? (
              <ReviewForm placeId={place.id} slug={place.slug} isDemo={current.isDemo} />
            ) : (
              <div className="mt-6 border-t border-line pt-5 text-sm text-muted">
                <Link
                  href={`/masuk?next=/tempat/${place.slug}`}
                  className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-2"
                >
                  Masuk
                </Link>{" "}
                untuk menulis ulasan.
              </div>
            )}
          </section>
        </div>

        <aside aria-label="Informasi tempat" className="space-y-6">
          <PlaceMap
            places={[place]}
            interactive={false}
            fitToPlaces
            height="h-56"
            ariaLabel={`Lokasi ${place.name}`}
          />

          <section className="border-t border-line pt-4">
            <h2 className="font-display text-xl font-semibold">Info tempat</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Kategori</dt>
                <dd className="text-right text-ink">{place.category.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Kisaran harga</dt>
                <dd className="text-right text-ink">
                  {formatPriceRange(place.price_min, place.price_max)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Jarak dari kampus</dt>
                <dd className="text-right text-ink">{formatDistance(place.distance_km)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Jam buka</dt>
                <dd className="text-right text-ink">
                  {place.open_hours.note ?? "Belum diverifikasi"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Koordinat</dt>
                <dd className="text-right font-mono text-xs text-ink">
                  {place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Sumber</dt>
                <dd className="text-right text-ink">
                  {place.source === "osm" ? "OpenStreetMap" : place.source === "user" ? "Komunitas" : "Demo"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="border-t border-line pt-4">
            <h2 className="font-display text-xl font-semibold">Catatan data</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{sourceNote(place)}</p>
            {place.osm_id ? (
              <a
                href={`https://www.openstreetmap.org/${place.osm_id}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline underline-offset-2"
              >
                Lihat di OpenStreetMap
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ) : null}
            <p className="mt-3 font-mono text-[10px] text-muted">{SITE.osmAttribution}</p>
          </section>

          <ReportPlaceForm placeId={place.id} isDemo={current.isDemo} />
        </aside>
      </div>
    </div>
  );
}
