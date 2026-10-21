"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { ImagePlus, PenLine } from "lucide-react";
import { createPostAction } from "@/app/actions/posts";
import { FormMessage } from "@/components/ui/form-message";
import { FieldHint, FieldLabel, Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { POST_CATEGORIES } from "@/lib/constants";
import type { Place } from "@/lib/types";

export function PostComposer({
  places,
  isDemo,
}: {
  places: Place[];
  isDemo?: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(createPostAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <section className="border-b border-line py-6" aria-labelledby="composer-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="composer-title" className="font-display text-xl font-semibold text-ink">
            Bagi pengalaman
          </h2>
          <p className="mt-1 text-sm text-muted">
            Tulis info yang kamu ingin temukan sendiri waktu pertama kali sampai di Jakarta.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex min-h-9 items-center gap-2 rounded-sm border border-ink bg-signal px-3 text-sm font-semibold text-ink"
        >
          <PenLine className="h-4 w-4" aria-hidden="true" />
          {open ? "Tutup" : "Tulis"}
        </button>
      </div>

      {open ? (
        <form ref={formRef} action={formAction} className="mt-5 space-y-4">
          <div>
            <FieldLabel htmlFor="post-body">Isi postingan</FieldLabel>
            <Textarea
              id="post-body"
              name="body"
              rows={4}
              required
              placeholder="Contoh: Warung di sebelah gerbang timur buka sampai jam 11 malam. Nasi ayam Rp15 ribu, porsi besar."
            />
            <FieldHint>Jangan bagikan nomor pribadi atau alamat kos yang detail.</FieldHint>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="post-category">Kategori</FieldLabel>
              <Select id="post-category" name="category" defaultValue="tips">
                {Object.entries(POST_CATEGORIES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel htmlFor="post-place">Tandai tempat</FieldLabel>
              <Select id="post-place" name="place_id" defaultValue="">
                <option value="">Tanpa tempat</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted">
            Semua postingan dapat dibaca publik. Like, komentar, dan simpan memerlukan login.
          </p>

          <div>
            <FieldLabel htmlFor="post-photo">URL foto</FieldLabel>
            <Input
              id="post-photo"
              name="photo_url"
              type="url"
              placeholder="https://..."
              inputMode="url"
            />
            <FieldHint>
              Untuk MVP, foto memakai URL. Unggah langsung ke Supabase Storage bisa ditambahkan setelah
              kredensial aktif.
            </FieldHint>
          </div>

          {isDemo ? (
            <p className="text-xs leading-relaxed text-muted">
              Mode demo belum menyimpan postingan. Form tetap bisa dicoba untuk melihat validasi.
            </p>
          ) : null}

          <FormMessage message={state?.message} ok={state?.ok} />

          <div className="flex items-center gap-3">
            <SubmitButton pendingLabel="Mengirim...">Kirim postingan</SubmitButton>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              Foto bersifat opsional
            </span>
          </div>
        </form>
      ) : null}
    </section>
  );
}
