import { Calendar, Check, ChevronRight, MapPin, MessageCircle, ShieldCheck, Shuffle, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import { oneOnOneUser, type UserCard } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

export function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    onboardingCompleted,
    profileProgress,
    oneOnOneStatus,
    groupStatus,
    startOneOnOneWaiting,
    resolveOneOnOneAccepted,
    skipOneOnOne
  } = useDemoStore();

  const accept = () => {
    startOneOnOneWaiting();
    showToast("已接受，正在等待对方确认");
    window.setTimeout(() => {
      resolveOneOnOneAccepted();
      showToast("对方已通过");
    }, 1000);
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="本周匹配" subtitle="三种模式，选一种合你的" />

      {!onboardingCompleted ? (
        <PersonaNudge progress={profileProgress} onTap={() => navigate("/persona")} />
      ) : null}

      <section className="space-y-2">
        <SectionHeader title="每周 1v1" hint="基础匹配" />
        <OneOnOneCard
          status={oneOnOneStatus}
          user={oneOnOneUser}
          onAccept={accept}
          onPass={() => {
            skipOneOnOne();
            showToast("已跳过本周推荐");
          }}
          onDetails={() => navigate("/match/one-on-one")}
          onOpenChat={() => navigate("/chat")}
        />
      </section>

      <section className="space-y-2">
        <SectionHeader title="每周主题局" hint="3v3 多人活动" />
        <ModeCard
          icon={<UsersRound className="h-5 w-5" />}
          tone="sage"
          title="本周：3v3 北京咖啡轻社交局"
          desc={
            groupStatus === "confirmed"
              ? "已确认本周日 14:00"
              : groupStatus === "joined" || groupStatus === "planning"
                ? "已加入，正在投票地点"
                : "可选剧本杀 · 阿瓦隆 · 徒步 · 咖啡"
          }
          actionLabel={groupStatus === "available" ? "去看本周场景" : "查看进度"}
          onTap={() => navigate("/match/group")}
        />
      </section>

      <section className="space-y-2">
        <SectionHeader title="随时匹配" hint="3 张卡片，立即看人" />
        <ModeCard
          icon={<Shuffle className="h-5 w-5" />}
          tone="lilac"
          title="AI 现在就为你推荐 3 个人"
          desc="按你的画像随机挑选，可以发起请求也可以跳过"
          actionLabel="开始随时匹配"
          onTap={() => navigate("/cards")}
        />
      </section>

      <Card className="flex items-start gap-3 bg-[#f8fbf7] shadow-none">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
        <p className="text-xs leading-relaxed text-muted">
          首次见面建议公共场所，平台不展示真实姓名和联系方式。具体地点由双方在聊天中商定。
        </p>
      </Card>
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex items-baseline justify-between px-1">
      <h2 className="text-sm font-black text-ink">{title}</h2>
      <span className="text-[11px] font-semibold text-muted">{hint}</span>
    </div>
  );
}

function PersonaNudge({ progress, onTap }: { progress: number; onTap: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="w-full rounded-[1.55rem] border border-line bg-[#fffaf4] p-4 text-left shadow-soft"
    >
      <p className="text-xs font-semibold text-coffee">先和 AI 聊聊</p>
      <p className="mt-1 text-sm font-black text-ink">
        AI 还在了解你（{progress || 0}%），匹配会更准
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        点这里去 AI 搭子页继续对话
      </p>
    </button>
  );
}

function OneOnOneCard({
  status,
  user,
  onAccept,
  onPass,
  onDetails,
  onOpenChat
}: {
  status: ReturnType<typeof useDemoStore>["oneOnOneStatus"];
  user: UserCard;
  onAccept: () => void;
  onPass: () => void;
  onDetails: () => void;
  onOpenChat: () => void;
}) {
  if (status === "confirmed" || status === "activity_confirming") {
    return (
      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-sage/40 text-moss">
            <Check className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-ink">和 {user.alias} 见面</p>
            <p className="mt-0.5 text-xs text-muted">
              {status === "confirmed" ? "已确认" : "活动确认中"}
            </p>
          </div>
        </div>
        <div className="space-y-2 rounded-2xl bg-white/82 p-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-coffee" />
            <span>周六下午 15:00</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-coffee" />
            <span>具体地点你们在聊天里商定</span>
          </div>
        </div>
        <Button
          className="w-full"
          icon={<MessageCircle className="h-4 w-4" />}
          onClick={onOpenChat}
        >
          打开聊天
        </Button>
        <button
          type="button"
          className="w-full text-center text-xs font-bold text-muted"
          onClick={onDetails}
        >
          查看活动详情
        </button>
      </Card>
    );
  }

  if (status === "waiting_other") {
    return (
      <Card className="space-y-3 bg-[#fffaf4] text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-oatmeal">
          <span className="animate-pulse text-2xl">☕</span>
        </div>
        <p className="text-sm font-black text-ink">已发送给对方</p>
        <p className="text-xs leading-relaxed text-muted">
          等待对方确认中，对方通过后会进入聊天。
        </p>
      </Card>
    );
  }

  if (status === "skipped") {
    return (
      <Card className="space-y-2 bg-[#fffaf4]">
        <p className="text-sm font-black text-ink">本周已跳过</p>
        <p className="text-xs leading-relaxed text-muted">
          下周一早上，AI 会重新为你挑一个更合适的人。
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3 bg-[#fffaf4]">
      <div className="flex items-center gap-3">
        <AbstractAvatar seed={user.avatarSeed} label={user.alias} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-black text-ink">{user.alias}</p>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black text-coffee">
              {user.matchScore}%
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{user.bio}</p>
        </div>
      </div>

      <div className="space-y-1.5 rounded-2xl bg-white/82 p-3 text-xs text-muted">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-coffee" />
          <span>建议本周六下午</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-coffee" />
          <span>地点由你们聊天商定</span>
        </div>
      </div>

      <Button className="w-full" onClick={onAccept}>
        接受这次见面
      </Button>
      <div className="flex items-center justify-center gap-5 text-xs font-bold text-muted">
        <button type="button" onClick={onDetails}>
          为什么是 TA
        </button>
        <span className="text-line">·</span>
        <button type="button" onClick={onPass}>
          这周没空
        </button>
      </div>
    </Card>
  );
}

const toneBg: Record<string, string> = {
  sage: "bg-[#f4f7f3]",
  lilac: "bg-[#f4f1f7]"
};
const toneIcon: Record<string, string> = {
  sage: "bg-sage/40 text-moss",
  lilac: "bg-lilac/40 text-ink"
};

function ModeCard({
  icon,
  tone,
  title,
  desc,
  actionLabel,
  onTap
}: {
  icon: React.ReactNode;
  tone: keyof typeof toneBg;
  title: string;
  desc: string;
  actionLabel: string;
  onTap: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={`w-full rounded-[1.55rem] border border-line ${toneBg[tone]} p-4 text-left shadow-soft active:translate-y-[1px]`}
    >
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${toneIcon[tone]}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-ink">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{desc}</p>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
      </div>
      <div className="mt-3 text-xs font-bold text-coffee">{actionLabel} →</div>
    </button>
  );
}
