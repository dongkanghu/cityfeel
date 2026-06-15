import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-lift hover:bg-[#34302b] active:translate-y-[1px] disabled:bg-muted/60",
  secondary:
    "bg-oatmeal text-ink hover:bg-[#eadfce] active:translate-y-[1px] disabled:text-muted",
  ghost: "bg-transparent text-muted hover:bg-oatmeal active:translate-y-[1px]",
  danger:
    "bg-[#f7e8df] text-[#954a25] hover:bg-[#efd6c6] active:translate-y-[1px]",
  outline:
    "border border-line bg-white text-ink hover:bg-cream active:translate-y-[1px]"
};

export function Button({
  className,
  children,
  variant = "primary",
  loading = false,
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coffee/40 disabled:cursor-not-allowed disabled:opacity-70",
        variantClass[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      <span className="truncate">{children}</span>
    </button>
  );
}
