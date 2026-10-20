"use client";

import { useActionState, useState, useTransition } from "react";
import { Bookmark, Flag } from "lucide-react";
import { reportAction, savePlaceAction } from "@/app/actions/places";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { FieldLabel, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function SavePlaceButton({
  placeId,
  initialSaved,
}: {
  placeId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !saved;
    setSaved(next);
    setMessage(null);

    startTransition(async () => {
      const result = await savePlaceAction(placeId, next);
      if (!result.ok) {
        setSaved(!next);
        setMessage(result.message ?? "Simpanan belum tersimpan.");
      }
    });
  }

  return (
    <div>
      <Button
        type="button"
        variant={saved ? "secondary" : "outline"}
        onClick={toggle}
        loading={isPending}
      >
        <Bookmark className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} aria-hidden="true" />
        {saved ? "Tersimpan" : "Simpan"}
      </Button>
      {message ? <FormMessage message={message} className="mt-2 max-w-xs" /> : null}
    </div>
  );
}

export function ReportPlaceForm({
  placeId,
  isDemo,
}: {
  placeId: string;
  isDemo: boolean;
}) {
  const [state, formAction] = useActionState(reportAction, null);

  return (
    <details className="border-t border-line pt-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink">
        <Flag className="h-4 w-4" aria-hidden="true" />
        Laporkan info yang salah
      </summary>
      <form action={formAction} className="mt-3">
        <input type="hidden" name="target_type" value="place" />
        <input type="hidden" name="target_id" value={placeId} />
        <FieldLabel htmlFor="report-reason">Apa yang perlu dicek?</FieldLabel>
        <Textarea
          id="report-reason"
          name="reason"
          rows={3}
          required
          placeholder="Contoh: harga sudah naik, tempat sudah tutup, atau alamatnya bergeser."
        />
        {isDemo ? (
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Mode demo belum mengirim laporan.
          </p>
        ) : null}
        <div className="mt-3">
          <FormMessage message={state?.message} ok={state?.ok} />
        </div>
        <div className="mt-3">
          <SubmitButton pendingLabel="Mengirim...">Kirim laporan</SubmitButton>
        </div>
      </form>
    </details>
  );
}
