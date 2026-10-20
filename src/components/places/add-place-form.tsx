"use client";

import dynamic from "next/dynamic";
import { useActionState, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { createPlaceAction } from "@/app/actions/places";
import { FormMessage } from "@/components/ui/form-message";
import { FieldHint, FieldLabel, Input, Select, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { CAMPUS_CENTER, FACILITY_OPTIONS, PRICE_LEVELS } from "@/lib/constants";
import type { Campus, Category } from "@/lib/types";

const LocationPicker = dynamic(
  () => import("@/components/map/location-picker").then((module) => module.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[340px] place-items-center rounded-md border border-line bg-paper-deep">
        <span className="font-mono text-xs text-muted">Memuat peta...</span>
      </div>
    ),
  },
);

export function AddPlaceForm({
  categories,
  campus,
  isDemo,
}: {
  categories: Category[];
  campus: Campus;
  isDemo: boolean;
}) {
  const [state, formAction] = useActionState(createPlaceAction, null);
  const [coordinates, setCoordinates] = useState({
    latitude: CAMPUS_CENTER.latitude,
    longitude: CAMPUS_CENTER.longitude,
  });

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <input type="hidden" name="latitude" value={coordinates.latitude} />
      <input type="hidden" name="longitude" value={coordinates.longitude} />

      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="place-name">Nama tempat</FieldLabel>
            <Input
              id="place-name"
              name="name"
              required
              placeholder="Contoh: Warung Nasi Bu Tini"
            />
          </div>

          <div>
            <FieldLabel htmlFor="place-category">Kategori</FieldLabel>
            <Select id="place-category" name="category_id" required defaultValue="">
              <option value="" disabled>
                Pilih kategori
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel htmlFor="place-price-level">Kisaran harga</FieldLabel>
            <Select id="place-price-level" name="price_level" defaultValue="2">
              {PRICE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label} · {level.hint}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel htmlFor="place-address">Alamat atau patokan</FieldLabel>
            <Input
              id="place-address"
              name="address"
              placeholder="Contoh: Jl. Lingkar Luar Barat, seberang gerbang timur kampus"
            />
            <FieldHint>Patokan lebih berguna daripada alamat lengkap yang panjang.</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="place-price-min" hint="opsional">
              Harga minimum
            </FieldLabel>
            <Input
              id="place-price-min"
              name="price_min"
              type="number"
              min={0}
              step={1000}
              placeholder="10000"
              inputMode="numeric"
            />
          </div>

          <div>
            <FieldLabel htmlFor="place-price-max" hint="opsional">
              Harga maksimum
            </FieldLabel>
            <Input
              id="place-price-max"
              name="price_max"
              type="number"
              min={0}
              step={1000}
              placeholder="30000"
              inputMode="numeric"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel htmlFor="place-description" hint="opsional">
              Deskripsi singkat
            </FieldLabel>
            <Textarea
              id="place-description"
              name="description"
              rows={4}
              placeholder="Apa yang membuat tempat ini berguna untuk mahasiswa? Sebutkan porsi, suasana, WiFi, atau hal lain yang perlu dicek."
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel htmlFor="place-hours" hint="opsional">
              Jam buka
            </FieldLabel>
            <Input
              id="place-hours"
              name="open_hours_note"
              placeholder="Contoh: Setiap hari 08.00 sampai 22.00"
            />
          </div>
        </section>

        <fieldset className="border-t border-line pt-5">
          <legend className="text-sm font-medium text-ink">Fasilitas yang terlihat</legend>
          <p className="mt-1 text-xs text-muted">
            Centang yang kamu yakin. Jangan menebak kalau belum melihat langsung.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FACILITY_OPTIONS.map((facility) => (
              <label
                key={facility}
                className="flex min-h-9 items-center gap-2 rounded-sm px-1 text-sm text-ink-soft hover:bg-paper-deep"
              >
                <input
                  type="checkbox"
                  name="facilities"
                  value={facility}
                  className="h-4 w-4 accent-signal"
                />
                {facility}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="border-t border-line pt-5">
          <div className="flex items-start gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Tempat baru akan berstatus menunggu verifikasi. Admin mengecek nama, alamat, dan
            kategori sebelum tempat tampil untuk semua orang.
          </div>

          {isDemo ? (
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Mode demo belum menyimpan tempat. Form tetap bisa dicoba untuk melihat validasi.
            </p>
          ) : null}

          <div className="mt-4">
            <FormMessage message={state?.message} ok={state?.ok} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <SubmitButton pendingLabel="Mengirim...">Kirim untuk verifikasi</SubmitButton>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Bisa disunting setelah dikirim
            </span>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="lg:sticky lg:top-6">
          <div className="mb-3">
            <h2 className="font-display text-xl font-semibold">Tentukan pin lokasi</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Klik peta atau geser pin. Titik yang tepat membuat tempat mudah ditemukan.
            </p>
          </div>
          <LocationPicker
            latitude={coordinates.latitude}
            longitude={coordinates.longitude}
            onChange={(latitude, longitude) => setCoordinates({ latitude, longitude })}
          />
          <p className="mt-3 font-mono text-[10px] leading-relaxed text-muted">
            Pusat awal: {campus.name}, {campus.city}.
          </p>
          <p className="mt-2 font-mono text-[10px] text-muted">
            © OpenStreetMap contributors
          </p>
        </div>
      </aside>
    </form>
  );
}
