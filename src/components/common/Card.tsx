import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[1.55rem] border border-line bg-white/92 p-4 shadow-soft",
        className
      )}
      {...props}
    />
  );
}
