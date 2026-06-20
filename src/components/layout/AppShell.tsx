import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { MobileBottomNav } from "./MobileBottomNav";

type AppShellProps = {
  children: ReactNode;
};

const fullScreenRoutes = new Set(["/onboarding"]);

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const showBottomNav = !fullScreenRoutes.has(location.pathname);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f4dfc4_0,#faf7f2_32%,#f7f3ee_100%)] text-ink">
      <div className="mx-auto min-h-screen w-full max-w-[430px] bg-cream shadow-[0_0_70px_rgba(62,43,29,0.13)]">
        <main className={showBottomNav ? "px-4 pb-28" : "px-4"}>{children}</main>
        {showBottomNav ? <MobileBottomNav /> : null}
      </div>
    </div>
  );
}
