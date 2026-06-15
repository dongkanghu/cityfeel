import { cn } from "./utils";

type AbstractAvatarProps = {
  seed: string;
  label: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const palettes = [
  "from-[#f7c38f] via-[#f4e2c8] to-[#8db99b]",
  "from-[#dfb6a5] via-[#f5eee4] to-[#82a6c7]",
  "from-[#d8b08c] via-[#fff6dc] to-[#9bb88f]",
  "from-[#b6c8a4] via-[#f8ead4] to-[#cc8e68]",
  "from-[#b9b0df] via-[#f6ede1] to-[#d6a36d]"
];

const sizeClass = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24"
};

export function AbstractAvatar({
  seed,
  label,
  size = "md",
  className
}: AbstractAvatarProps) {
  const index = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const palette = palettes[index % palettes.length];
  const initial = label.slice(0, 1);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br",
        palette,
        sizeClass[size],
        className
      )}
      aria-label={`${label}的抽象头像`}
      role="img"
    >
      <div className="absolute -left-3 top-2 h-8 w-8 rounded-full bg-white/45" />
      <div className="absolute bottom-1 right-1 h-5 w-9 rotate-[-18deg] rounded-full bg-ink/10" />
      <div className="absolute inset-0 grid place-items-center text-sm font-black text-ink/70">
        {initial}
      </div>
    </div>
  );
}
