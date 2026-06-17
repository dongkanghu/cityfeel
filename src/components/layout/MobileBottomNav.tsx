import { Coffee, MessageCircle, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../common/utils";

const items = [
  { label: "聊天", path: "/chat", icon: MessageCircle, match: "/friends" },
  {
    label: "聚会",
    path: "/gatherings",
    icon: Coffee,
    match: "/match",
    aliases: ["/home"]
  },
  { label: "画像", path: "/profile", icon: Sparkles, match: "/onboarding" }
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-line bg-white/92 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-14px_40px_rgba(69,49,33,0.10)] backdrop-blur-xl">
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.path ||
            item.aliases?.includes(location.pathname) ||
            Boolean(item.match && location.pathname.startsWith(item.match));
          return (
            <NavLink
              key={item.path}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1.5 py-2 text-[11px] font-semibold text-muted transition",
                active && "bg-oatmeal text-ink"
              )}
              to={item.path}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
