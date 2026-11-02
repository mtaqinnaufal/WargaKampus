"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { reviewAction } from "@/app/actions/places";
import { FormMessage } from "@/components/ui/form-message";
import { FieldHint, FieldLabel, Textarea } from "@/components/ui/input";
import { RatingInput } from "@/components/ui/star-rating";
import { SubmitButton } from "@/components/ui/submit-button";
import { uploadReviewPhotos } from "@/lib/storage-client";

export function ReviewForm({
  placeId,
  slug,
  isDemo,
}: {
  placeId: string;
  slug: string;
  isDemo: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(reviewAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const photoFilesRef = useRef<File[]>([]);
  const handledRef = useRef(false);
  const [uploading, setUploading] = useState(false);

  function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    photoFilesRef.current = Array.from(event.target.files ?? []).filter(
      (file) => file.size > 0,
    );
  }

  useEffect(() => {
    if (!state?.ok || handledRef.current) return;
    handledRef.current = true;

    const reviewId = (state.data as { reviewId?: string } | undefined)?.reviewId;
    const files = photoFilesRef.current;

    const finish = () => {
      handledRef.current = false;
      photoFilesRef.current = [];
      setUploading(false);
      formRef.current?.reset();
      router.refresh();
    };

    if (!reviewId || files.length === 0) {
      finish();
      return;
    }

    setUploading(true);
    uploadReviewPhotos(reviewId, files)
      .catch(() => undefined)
      .finally(finish);
  }, [state, router]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-6 border-t border-line pt-5"
    >
      <input type="hidden" name="place_id" value={placeId} />
      <input type="hidden" name="slug" value={slug} />

      <h3 className="font-display text-xl font-semibold">Tulis ulasan</h3>
      <p className="mt-1 text-sm text-muted">
        Ceritakan pengalaman nyata. Sebutkan hal yang berguna: harga, porsi, WiFi, atau jam ramai.
      </p>

      <div className="mt-4">
        <RatingInput name="rating" defaultValue={5} />
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="review-body" hint="opsional">
          Catatan
        </FieldLabel>
        <Textarea
          id="review-body"
          name="body"
          rows={4}
          placeholder="Contoh: ayam bakarnya besar, sambalnya pedas. Datang sebelum jam 12 supaya tidak menunggu."
        />
      </div>

      <div className="mt-4">
        <FieldLabel htmlFor="review-photos" hint="opsional">
          Foto
        </FieldLabel>
        <input
          id="review-photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosChange}
          className="mt-2 block w-full cursor-pointer text-xs text-muted file:mr-3 file:rounded-sm file:border-0 file:bg-paper-deep file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink"
        />
        <FieldHint>JPG, PNG, WebP, atau GIF. Maksimal 5 MB per gambar.</FieldHint>
      </div>

      {isDemo ? (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Mode demo belum menyimpan ulasan. Form tetap bisa dicoba untuk melihat validasi.
        </p>
      ) : null}

      <div className="mt-4">
        <FormMessage message={state?.message} ok={state?.ok} />
      </div>

      <div className="mt-4">
        <SubmitButton pendingLabel="Menyimpan...">
          {uploading ? "Mengunggah foto..." : "Simpan ulasan"}
        </SubmitButton>
      </div>
    </form>
  );
}
