import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-5 py-12">
      <div className="w-full max-w-lg">
        <BrandMark />
        <p className="mt-10 font-mono text-[11px] text-muted">404</p>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight">
          Halaman ini tidak ada.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Tautannya mungkin salah atau halaman sudah dipindahkan. Mulai lagi dari peta atau
          linimasa.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/" className="underline decoration-signal decoration-2 underline-offset-4">
            Beranda
          </Link>
          <Link href="/jelajah" className="underline decoration-signal decoration-2 underline-offset-4">
            Jelajah
          </Link>
          <Link href="/linimasa" className="underline decoration-signal decoration-2 underline-offset-4">
            Linimasa
          </Link>
        </div>
      </div>
    </div>
  );
}
