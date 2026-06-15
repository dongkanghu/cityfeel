import type { ReactNode } from "react";

type TopBarProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function TopBar({ title, subtitle, right }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-3 border-b border-line/70 bg-cream/88 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black text-ink">{title}</h1>
          {subtitle ? <p className="mt-0.5 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {right}
      </div>
    </header>
  );
}
