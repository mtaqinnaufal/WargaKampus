import { DemoBanner } from "@/components/app-shell/demo-banner";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { MobileTopBar } from "@/components/app-shell/mobile-top-bar";
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

      <AppSidebar
        profile={current.profile}
        campus={campus}
        isDemo={current.isDemo}
      />
      <MobileTopBar
        profile={current.profile}
        campus={campus}
        isDemo={current.isDemo}
      />

      <main id="main" className="min-h-dvh lg:pl-[248px]">
        <DemoBanner isDemo={current.isDemo} />
        <div className="pb-24 lg:pb-0">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
