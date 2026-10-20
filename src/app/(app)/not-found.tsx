import Link from "next/link";

export default function AppNotFound() {
  return (
    <div className="container-page py-16">
      <p className="font-mono text-[11px] text-muted">404</p>
      <h1 className="mt-2 max-w-[18ch] font-display text-3xl font-bold leading-tight sm:text-4xl">
        Tempat atau halaman ini tidak ditemukan.
      </h1>
      <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted">
        Mungkin tempatnya belum diverifikasi, sudah dihapus, atau tautannya berubah. Coba cari
        lagi di peta.
      </p>
      <Link
        href="/jelajah"
        className="mt-5 inline-flex text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
      >
        Kembali ke jelajah
      </Link>
    </div>
  );
}
