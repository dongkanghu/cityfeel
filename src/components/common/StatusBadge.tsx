import type { ReactNode } from "react";
import { cn } from "./utils";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "ready" | "waiting" | "success" | "quiet" | "warning";
  className?: string;
};

const toneClass = {
  ready: "bg-[#eaf1ff] text-[#355087] border-[#dbe6fb]",
  waiting: "bg-[#fff3dd] text-[#8a5a1f] border-[#f3dfb8]",
  success: "bg-[#e4f2ea] text-[#2f6d50] border-[#cfe8da]",
  quiet: "bg-cream text-muted border-line",
  warning: "bg-[#f7e8df] text-[#954a25] border-[#efd6c6]"
};

export function StatusBadge({
  children,
  tone = "quiet",
  className
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
