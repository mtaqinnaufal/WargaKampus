"use client";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-page py-16" role="alert">
      <p className="font-mono text-[11px] text-muted">Terjadi kesalahan</p>
      <h1 className="mt-2 max-w-[20ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
        Halaman ini tidak bisa dimuat.
      </h1>
      <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
        Coba muat ulang. Kalau masih gagal, cek koneksi Supabase dan pastikan schema sudah
        dijalankan.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>
          Coba lagi
        </Button>
        <a href="/jelajah" className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-2">
          Kembali ke jelajah
        </a>
      </div>
      {error.digest ? (
        <p className="mt-6 font-mono text-[10px] text-muted">Kode: {error.digest}</p>
      ) : null}
    </div>
  );
}
