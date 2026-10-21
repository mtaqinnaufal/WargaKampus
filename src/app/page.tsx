import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";
import { PlaceMap } from "@/components/map/place-map";
import { PostPreview } from "@/components/feed/post-preview";
import { PlaceTile } from "@/components/places/place-tile";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { getCurrentUser } from "@/lib/auth";
import { getDefaultCampus } from "@/lib/data/campuses";
import { getPlaces } from "@/lib/data/places";
import { getPosts } from "@/lib/data/posts";
import { SITE } from "@/lib/constants";
import { formatPriceRange } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WargaKampus | Tempat masuk akal di sekitar ITPLN",
  description:
    "Peta komunitas warga kampus untuk menemukan makan, nugas, nongkrong, laundry, dan kebutuhan harian di sekitar Institut Teknologi PLN, Jakarta Barat.",
};

export default async function HomePage() {
  const current = await getCurrentUser();
  const campus = await getDefaultCampus();
  const [allPlaces, posts] = await Promise.all([
    getPlaces(),
    getPosts({ campusId: campus.id, userId: current.user?.id ?? null, limit: 4 }),
  ]);

  const places = [...allPlaces]
    .sort((a, b) => b.rating_avg - a.rating_avg || b.review_count - a.review_count)
    .slice(0, 8);

  const featured = places[0];
  const contributors = new Set(posts.map((post) => post.author.id)).size;

  return (
    <div className="min-h-dvh bg-paper">
      <SiteHeader profile={current.profile} isDemo={current.isDemo} />

      <main id="main">
        <section className="container-page grid gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-16">
          <div className="reveal">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden="true" />
                {SITE.campusShort} · Duri Kosambi
              </span>
              <span aria-hidden="true">/</span>
              <span>Radius 5 km</span>
              <span aria-hidden="true">/</span>
              <span>Data komunitas</span>
            </div>

            <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(3.2rem,7.4vw,6.4rem)] font-bold leading-[0.9] tracking-[-0.055em] text-ink">
              Jakarta Barat, versi mahasiswa.
            </h1>

            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-ink-soft">
              Temukan makan, nugas, nongkrong, laundry, dan kebutuhan harian yang benar-benar
              masuk akal di sekitar ITPLN. Dikurasi oleh mahasiswa, bukan iklan.
            </p>

            <form action="/jelajah" className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">
                Cari tempat
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="Cari tempat, kategori, atau kebutuhan"
                className="h-11 w-full rounded-sm border border-line bg-surface px-3 text-base text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-signal/70"
              />
              <button type="submit" className={buttonClass({ variant: "primary", size: "md" })}>
                Cari tempat
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/jelajah"
                className={buttonClass({ variant: "secondary", size: "md" })}
              >
                Buka peta
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/linimasa"
                className={buttonClass({ variant: "outline", size: "md" })}
              >
                Lihat linimasa
              </Link>
            </div>

            <dl className="mt-8 grid max-w-lg grid-cols-3 divide-x divide-line border-y border-line">
              <div className="py-4 pr-4">
                <dt className="text-xs text-muted">Tempat terverifikasi</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                  {allPlaces.length}
                </dd>
              </div>
              <div className="px-4 py-4">
                <dt className="text-xs text-muted">Cerita minggu ini</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                  {posts.length}
                </dd>
              </div>
              <div className="py-4 pl-4">
                <dt className="text-xs text-muted">Kontributor</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold text-ink">
                  {contributors}
                </dd>
              </div>
            </dl>

            <p className="mt-4 max-w-[54ch] text-xs leading-relaxed text-muted">
              Data awal dari OpenStreetMap. Harga, fasilitas, dan jam buka perlu dicek ulang oleh
              komunitas.
            </p>
          </div>

          <div className="reveal reveal-delay-2">
            <div className="overflow-hidden rounded-md border border-line bg-surface shadow-lift">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="font-mono text-[11px] text-ink-soft">Peta sekitar ITPLN</span>
                <Badge variant="signal">Radius 5 km</Badge>
              </div>

              <div className="relative">
                <PlaceMap
                  places={places.slice(0, 8)}
                  interactive={false}
                  fitToPlaces
                  height="h-[360px] lg:h-[510px]"
                  ariaLabel="Pratinjau peta tempat di sekitar Institut Teknologi PLN"
                />

                {featured ? (
                  <Link
                    href={`/tempat/${featured.slug}`}
                    className="absolute bottom-4 left-4 right-4 z-[500] rounded-md border border-line bg-surface/95 p-3 shadow-lift backdrop-blur sm:right-auto sm:w-[300px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                      <span className="font-mono text-[10px] text-muted">
                        {featured.category.name}
                      </span>
                      <span className="ml-auto font-mono text-[10px] text-muted">
                        {featured.distance_km?.toFixed(1)} km
                      </span>
                    </div>
                    <p className="mt-1 font-display text-lg font-semibold leading-tight">
                      {featured.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <StarRating rating={featured.rating_avg} count={featured.review_count} />
                      <span className="text-[11px] text-muted">
                        {formatPriceRange(featured.price_min, featured.price_max)}
                      </span>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
                      Lihat tempat
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2">
                <span className="font-mono text-[10px] text-muted">
                  {SITE.osmAttribution}
                </span>
                <span className="text-[10px] text-muted">
                  Pin bisa dipakai untuk melihat detail.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-surface/45">
          <div className="container-page grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
            <div>
              <h2 className="max-w-[15ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
                Tiga langkah, tanpa ribet.
              </h2>
              <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted">
                WargaKampus dibuat untuk keputusan kecil yang terjadi terus-menerus: mau makan di
                mana, nugas di mana, dan laundry di mana.
              </p>
            </div>

            <ol className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Cari di peta",
                  body: "Filter kategori, harga, dan jarak. Pin menunjukkan tempat yang sudah dicek.",
                  icon: MapPin,
                },
                {
                  number: "02",
                  title: "Baca kata mahasiswa",
                  body: "Lihat pengalaman, foto, dan harga terbaru dari orang yang sudah datang.",
                  icon: MessageSquare,
                },
                {
                  number: "03",
                  title: "Tambah yang belum ada",
                  body: "Tempel pin, isi info, lalu admin verifikasi. Kontribusimu membantu yang lain.",
                  icon: Plus,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <li key={step.number} className="border-t border-ink/30 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted">{step.number}</span>
                      <Icon className="h-4 w-4 text-ink" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="container-page py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="max-w-[12ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
                Lagi rame di sekitar kampus.
              </h2>
              <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted">
                Info dari mahasiswa yang baru saja datang. Bukan ulasan bintang lima yang dibuat
                untuk algoritma.
              </p>
              <Link
                href="/linimasa"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
              >
                Buka linimasa
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div>
              {posts.length > 0 ? (
                <>
                  <PostPreview post={posts[0]} lead />
                  {posts.slice(1, 3).map((post) => (
                    <PostPreview key={post.id} post={post} />
                  ))}
                </>
              ) : (
                <div className="border-t border-line pt-6 text-sm text-muted">
                  Belum ada cerita. Jadi yang pertama menulis di linimasa.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="container-page py-12 lg:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Tempat yang layak dicoba.
                </h2>
                <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted">
                  Pilihan awal dari data OpenStreetMap. Setiap tempat punya alamat, jarak, dan
                  catatan yang bisa kamu cek sebelum berangkat.
                </p>
              </div>
              <Link
                href="/jelajah"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
              >
                Lihat semua tempat
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-x-8 md:grid-cols-2">
              {places.slice(0, 4).map((place, index) => (
                <PlaceTile
                  key={place.id}
                  place={place}
                  featured={index === 0}
                  className={index === 0 ? "md:col-span-2" : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ink text-surface">
          <div className="container-page relative overflow-hidden py-12 lg:py-16">
            <div className="grid-paper absolute inset-0 opacity-[0.08]" aria-hidden="true" />
            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h2 className="max-w-[16ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Punya tempat yang belum ada di peta?
                </h2>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-surface/85">
                  Tempel pin, isi nama dan kategori, lalu kirim. Admin akan mengecek sebelum
                  tempat tampil untuk semua orang.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/tempat/baru"
                  className={buttonClass({ variant: "primary", size: "lg" })}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Tambah tempat
                </Link>
                <Link
                  href="/jelajah"
                  className={buttonClass({
                    variant: "outline",
                    size: "lg",
                    className: "border-surface text-surface hover:bg-surface/10",
                  })}
                >
                  Buka peta
                </Link>
              </div>
            </div>
            <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-surface/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Tempat baru diverifikasi admin
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                Komunitas mahasiswa ITPLN
              </span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
