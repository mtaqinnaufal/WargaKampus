"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ImagePlus } from "lucide-react";
import { uploadPlaceMediaClient } from "@/lib/place-media-client";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

export function PlaceMediaForm({
  placeId,
  slug,
  isDemo,
}: {
  placeId: string;
  slug: string;
  isDemo: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const bannerValue = formData.get("banner");
    const pricelistValue = formData.get("pricelist");
    const banner = bannerValue instanceof File && bannerValue.size > 0 ? bannerValue : null;
    const pricelist =
      pricelistValue instanceof File && pricelistValue.size > 0 ? pricelistValue : null;
    const photos = formData
      .getAll("photos")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!banner && !pricelist && photos.length === 0) {
      setMessage("Pilih minimal satu gambar untuk diunggah.");
      return;
    }

    setPending(true);
    setMessage(null);

    try {
      await uploadPlaceMediaClient(placeId, { banner, pricelist, photos });
      window.location.assign(`/tempat/${slug}?media=ok`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Media gagal diunggah. Coba lagi.",
      );
      setPending(false);
    }
  }

  return (
    <section
      aria-labelledby="place-media-title"
      className="rounded-xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(11,26,40,0.04)]"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-paper-deep">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="place-media-title" className="font-display text-xl font-semibold">
            Kelola media usaha
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Unggah banner, pricelist, atau foto baru. Banner dan pricelist terbaru akan tampil
            di halaman ini.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4 space-y-4">
        <div className="space-y-3">
          <label htmlFor="media-banner" className="block text-xs font-medium text-ink">
            Banner usaha
            <input
              id="media-banner"
              name="banner"
              type="file"
              accept="image/*"
              className="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"
            />
          </label>
          <label htmlFor="media-pricelist" className="block text-xs font-medium text-ink">
            Gambar pricelist
            <input
              id="media-pricelist"
              name="pricelist"
              type="file"
              accept="image/*"
              className="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"
            />
          </label>
          <label htmlFor="media-photos" className="block text-xs font-medium text-ink">
            Foto usaha
            <input
              id="media-photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"
            />
            <span className="mt-1 block text-[10px] text-muted">
              Bisa pilih beberapa foto. Maksimal 5 MB per gambar.
            </span>
          </label>
        </div>

        {isDemo ? (
          <p className="text-xs leading-relaxed text-muted">
            Mode demo belum menyimpan media. Sambungkan Supabase untuk mengaktifkan unggahan.
          </p>
        ) : null}

        <FormMessage message={message} />
        <Button type="submit" loading={pending} className="w-full">
          {pending ? "Mengunggah..." : "Unggah media"}
        </Button>
      </form>
    </section>
  );
}
