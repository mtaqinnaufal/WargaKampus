import { AppTopBar } from "@/components/app-shell/app-top-bar";
import { DemoBanner } from "@/components/app-shell/demo-banner";
import { getCurrentUser } from "@/lib/auth";
import { getDefaultCampus } from "@/lib/data/campuses";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [current, campus] = await Promise.all([getCurrentUser(), getDefaultCampus()]);

  return (
    <div className="min-h-dvh bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
      >
        Lewati ke konten
      </a>

      <AppTopBar profile={current.profile} campus={campus} />
      <DemoBanner isDemo={current.isDemo} />

      <main id="main" className="min-h-dvh">
        {children}
      </main>
    </div>
  );
}
