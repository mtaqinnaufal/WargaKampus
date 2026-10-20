"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { reviewAction } from "@/app/actions/places";
import { FormMessage } from "@/components/ui/form-message";
import { FieldLabel, Textarea } from "@/components/ui/input";
import { RatingInput } from "@/components/ui/star-rating";
import { SubmitButton } from "@/components/ui/submit-button";

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

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6 border-t border-line pt-5">
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

      {isDemo ? (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Mode demo belum menyimpan ulasan. Form tetap bisa dicoba untuk melihat validasi.
        </p>
      ) : null}

      <div className="mt-4">
        <FormMessage message={state?.message} ok={state?.ok} />
      </div>

      <div className="mt-4">
        <SubmitButton pendingLabel="Menyimpan...">Simpan ulasan</SubmitButton>
      </div>
    </form>
  );
}
