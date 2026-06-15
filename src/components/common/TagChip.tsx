import { cn } from "./utils";

type TagChipProps = {
  children: string;
  tone?: "coffee" | "sage" | "lilac" | "plain";
  className?: string;
};

const toneClass = {
  coffee: "bg-[#f4e4d4] text-[#6c432a] border-[#ead4bf]",
  sage: "bg-[#e6efe7] text-[#385d48] border-[#d4e3d6]",
  lilac: "bg-[#eeeafd] text-[#5d52bc] border-[#ded8fb]",
  plain: "bg-cream text-muted border-line"
};

export function TagChip({ children, tone = "plain", className }: TagChipProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        toneClass[tone],
        className
      )}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}
