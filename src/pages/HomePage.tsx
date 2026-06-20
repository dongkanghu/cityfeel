import { CalendarDays, ChevronRight, Shuffle, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { useDemoStore } from "../hooks/useDemoStore";

type ModeButtonProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bgClass: string;
  iconClass: string;
  onClick: () => void;
};

function ModeButton({ icon, title, desc, bgClass, iconClass, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[1.55rem] border border-line ${bgClass} p-5 text-left shadow-soft active:translate-y-[1px]`}
    >
      <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${iconClass}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-black text-ink">{title}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{desc}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </button>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { onboardingCompleted, profileProgress } = useDemoStore();

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="匹配" subtitle="选一种你喜欢的方式" />

      {!onboardingCompleted ? (
        <button
          type="button"
          onClick={() => navigate("/persona")}
          className="w-full rounded-[1.55rem] border border-line bg-[#fffaf4] p-4 text-left shadow-soft"
        >
          <p className="text-xs font-semibold text-coffee">先和 AI 聊聊</p>
          <p className="mt-1 text-sm font-black text-ink">
            AI 还在了解你（{profileProgress || 0}%），匹配会更准
          </p>
        </button>
      ) : null}

      <div className="space-y-3 pt-1">
        <ModeButton
          icon={<CalendarDays className="h-6 w-6" />}
          title="每周 1v1"
          desc="每周一次基础匹配，约一杯咖啡"
          bgClass="bg-[#fffaf4]"
          iconClass="bg-coffee/15 text-coffee"
          onClick={() => navigate("/match/one-on-one")}
        />
        <ModeButton
          icon={<UsersRound className="h-6 w-6" />}
          title="每周主题局"
          desc="3v3 剧本杀 · 阿瓦隆 · 徒步 · 咖啡"
          bgClass="bg-[#f4f7f3]"
          iconClass="bg-sage/40 text-moss"
          onClick={() => navigate("/match/group")}
        />
        <ModeButton
          icon={<Shuffle className="h-6 w-6" />}
          title="随时匹配"
          desc="AI 现在就为你推三个人，左右滑动看卡片"
          bgClass="bg-[#f4f1f7]"
          iconClass="bg-lilac/40 text-ink"
          onClick={() => navigate("/cards")}
        />
      </div>
    </div>
  );
}
