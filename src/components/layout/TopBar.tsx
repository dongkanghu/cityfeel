import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AbstractAvatar } from "../common/AbstractAvatar";
import { currentUser } from "../../data/mock";

type TopBarProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  showBack?: boolean;
};

export function TopBar({ title, subtitle, right, showBack }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hideAvatar = location.pathname === "/profile";

  return (
    <header className="sticky top-0 z-20 -mx-4 mb-3 border-b border-line/70 bg-cream/88 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {showBack ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="返回"
              className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition active:translate-y-[1px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black text-ink">{title}</h1>
            {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {right}
          {hideAvatar ? null : (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              aria-label="进入我的页面"
              className="rounded-full ring-1 ring-line transition active:translate-y-[1px]"
            >
              <AbstractAvatar
                seed={currentUser.avatarSeed}
                label={currentUser.alias}
                size="sm"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
