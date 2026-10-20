import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "KosPintar | Tempat masuk akal di sekitar ITPLN",
    template: "%s | KosPintar",
  },
  description:
    "Peta komunitas untuk menemukan tempat makan, nongkrong, nugas, laundry, dan kebutuhan harian di sekitar Institut Teknologi PLN, Jakarta Barat.",
  openGraph: {
    title: "KosPintar",
    description:
      "Temukan tempat yang masuk akal di sekitar ITPLN. Dibuat oleh mahasiswa, dirawat oleh mahasiswa.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
