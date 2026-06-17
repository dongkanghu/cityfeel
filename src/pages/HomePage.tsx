import {
  ChevronRight,
  Coffee,
  History,
  Info,
  MessageCircle,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { GatheringOptionCard } from "../components/gatherings/GatheringOptionCard";
import { Modal } from "../components/common/Modal";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import {
  cardRecommendations,
  currentUser,
  initialOneOnOneMessages,
  oneOnOneConversationId,
  oneOnOneUser,
  type UserCard
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

function planStatusLabel(status: string, onboardingCompleted: boolean) {
  if (!onboardingCompleted) return "待了解偏好";
  if (status === "confirmed") return "活动已确认";
  if (status === "activity_confirming") return "请确认地点";
  if (status === "waiting_other") return "等待对方确认";
  return "待确认推荐";
}

function groupStatusLabel(status: string) {
  if (status === "confirmed") return "活动已确认";
  if (status === "planning") return "地点投票中";
  if (status === "joined") return "已加入";
  return "可加入";
}

function acceptLabel(status: string) {
  if (status === "waiting_other") return "等待确认";
  if (status === "activity_confirming") return "已接受";
  if (status === "confirmed") return "已确认";
  return "接受";
}

export function HomePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [rulesOpen, setRulesOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const {
    profileProgress,
    selectedProfileTags,
    onboardingCompleted,
    oneOnOneStatus,
    groupStatus,
    cardRequestStatusMap,
    chats,
    startOneOnOneWaiting,
    resolveOneOnOneAccepted,
    skipOneOnOne
  } = useDemoStore();
  const newCards = cardRecommendations.filter(
    (user) => cardRequestStatusMap[user.id] === "default"
  ).length;
  const progress = onboardingCompleted ? profileProgress : 24;
  const tags = (selectedProfileTags.length ? selectedProfileTags : currentUser.tags).slice(0, 3);
  const oneOnOneMessages = chats[oneOnOneConversationId] ?? initialOneOnOneMessages;
  const lastOneOnOneMessage = oneOnOneMessages[oneOnOneMessages.length - 1];
  const weeklyUsers = [oneOnOneUser, ...cardRecommendations.slice(0, 2)];

  const acceptOneOnOne = () => {
    if (!onboardingCompleted) {
      navigate("/onboarding");
      return;
    }
    if (oneOnOneStatus !== "recommended" && oneOnOneStatus !== "skipped") {
      showToast("本周 1v1 推荐已进入下一阶段", "info");
      return;
    }

    startOneOnOneWaiting();
    showToast("已接受本周 1v1 推荐，正在等待对方确认", "info");
    window.setTimeout(() => {
      resolveOneOnOneAccepted();
      showToast("对方已通过，详情页可继续确认地点");
    }, 1000);
  };

  const rejectOneOnOne = () => {
    if (oneOnOneStatus !== "recommended" && oneOnOneStatus !== "skipped") {
      showToast("当前阶段不能拒绝该推荐", "info");
      return;
    }
    skipOneOnOne();
    showToast("已拒绝本周 1v1 推荐", "info");
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar
        title="聚会"
        subtitle="1v1 与 3v3 聚会都从这里进入"
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-muted shadow-sm"
              aria-label="查看历史和聊天"
              onClick={() => navigate("/chat")}
            >
              <History className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-muted shadow-sm"
              aria-label="查看匹配规则"
              onClick={() => setRulesOpen(true)}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <Card className="space-y-3 overflow-hidden bg-[#fffaf4]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-coffee">你今天只需要做一件事</p>
            <h1 className="mt-1 text-xl font-black leading-tight text-ink">
              {onboardingCompleted
                ? "本周 1v1 推荐"
                : "先让 AI 了解你的见面偏好"}
            </h1>
          </div>
          <StatusBadge tone={oneOnOneStatus === "confirmed" ? "success" : "waiting"}>
            {planStatusLabel(oneOnOneStatus, onboardingCompleted)}
          </StatusBadge>
        </div>

        {onboardingCompleted ? (
          <div className="rounded-[1.2rem] bg-white/82 p-3">
            <div className="flex items-center gap-3">
              <AbstractAvatar
                seed={oneOnOneUser.avatarSeed}
                label={oneOnOneUser.alias}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-ink">{oneOnOneUser.alias}</p>
                <p className="mt-0.5 truncate text-xs text-muted">
                  最后消息：{lastOneOnOneMessage?.content ?? "等待双方确认"}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-coffee">
                91%
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-[1.35rem] bg-cream p-3 text-sm leading-relaxed text-muted">
            先回答两个轻问题，再和 AI 补充一点见面偏好。完成后这里会出现你的本周推荐。
          </div>
        )}

        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <Button
            className="min-h-10 rounded-xl text-xs"
            disabled={oneOnOneStatus === "waiting_other" || oneOnOneStatus === "confirmed"}
            onClick={acceptOneOnOne}
          >
            {acceptLabel(oneOnOneStatus)}
          </Button>
          <Button
            className="min-h-10 rounded-xl text-xs"
            variant="secondary"
            disabled={oneOnOneStatus !== "recommended" && oneOnOneStatus !== "skipped"}
            onClick={rejectOneOnOne}
          >
            拒绝
          </Button>
          <Button
            className="min-h-10 rounded-xl px-3 text-xs"
            variant="outline"
            icon={<ChevronRight className="h-4 w-4" />}
            onClick={() => navigate("/match/one-on-one")}
          >
            详情
          </Button>
        </div>
        <button
          type="button"
          className="w-full text-center text-xs font-bold text-muted"
          onClick={() => setSignupOpen(true)}
        >
          调整本周意愿
        </button>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-black text-ink">本周用户卡片</h2>
          <span className="text-xs font-semibold text-muted">匿名头像</span>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {weeklyUsers.map((user, index) => (
            <CompactUserCard
              key={user.id}
              user={user}
              badge={index === 0 ? "1v1" : "卡片"}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-black text-ink">选择聚会方式</h2>
          <span className="text-xs font-semibold text-muted">本周推荐</span>
        </div>
        <GatheringOptionCard
          title="1v1 咖啡"
          subtitle="适合想先和一个人低压力确认时间、地点和聊天节奏。"
          status={planStatusLabel(oneOnOneStatus, onboardingCompleted)}
          to="/match/one-on-one"
          icon={<Coffee className="h-5 w-5" />}
          score="91%"
          tags={["安静聊天", "60-90 分钟", "边界清楚"]}
          tone={oneOnOneStatus === "confirmed" ? "success" : "waiting"}
        />
        <GatheringOptionCard
          title="3v3 咖啡局"
          subtitle="适合想降低单独见面压力，先在小组里自然认识。"
          status={groupStatusLabel(groupStatus)}
          to="/match/group"
          icon={<UsersRound className="h-5 w-5" />}
          score="88%"
          tags={["小组活动", "地点投票", "轻破冰"]}
          tone={groupStatus === "confirmed" ? "success" : "ready"}
        />
      </section>

      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted">画像辅助信息</p>
            <h2 className="text-base font-black text-ink">AI 已了解 {progress}%</h2>
          </div>
          <Link to="/profile" className="text-xs font-bold text-coffee">
            查看画像
          </Link>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-oatmeal">
          <div
            className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))}
        </div>
      </Card>

      <details className="group rounded-[1.55rem] border border-line bg-white/92 p-4 shadow-soft">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-black text-ink">
          其他选择
          <span className="text-xs font-semibold text-muted group-open:hidden">展开</span>
          <span className="hidden text-xs font-semibold text-muted group-open:inline">收起</span>
        </summary>
        <div className="mt-3 grid gap-2">
          <Link
            to="/match/group"
            className="flex items-center gap-3 rounded-2xl bg-cream p-3"
          >
            <UsersRound className="h-5 w-5 shrink-0 text-coffee" />
            <div className="min-w-0 flex-1">
              <p className="font-black text-ink">查看小组详情</p>
              <p className="text-xs text-muted">成员、地点投票和活动流程</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted" />
          </Link>
          <Link to="/cards" className="flex items-center gap-3 rounded-2xl bg-cream p-3">
            <MessageCircle className="h-5 w-5 shrink-0 text-coffee" />
            <div className="min-w-0 flex-1">
              <p className="font-black text-ink">先从匿名卡片聊聊</p>
              <p className="text-xs text-muted">{newCards} 张适合轻量认识的卡片</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted" />
          </Link>
        </div>
      </details>

      <Card className="flex items-start gap-3 bg-[#f8fbf7] shadow-none">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
        <p className="text-xs leading-relaxed text-muted">
          首次见面建议选择公共场所。平台不会在主流程展示真实姓名、联系方式或详细住址。
        </p>
      </Card>

      <Modal
        open={rulesOpen}
        title="匹配规则"
        confirmText="知道了"
        cancelText="关闭"
        onClose={() => setRulesOpen(false)}
      >
        <div className="space-y-2">
          {[
            "先了解你的见面节奏、聊天偏好和安全边界。",
            "每周只给少量推荐，优先降低选择压力。",
            "双方都同意后，才进入活动确认和聊天。",
            "首次见面建议选择公共场所，可随时屏蔽或举报。"
          ].map((item, index) => (
            <p key={item} className="rounded-2xl bg-cream p-3">
              {index + 1}. {item}
            </p>
          ))}
        </div>
      </Modal>

      <Modal
        open={signupOpen}
        title="报名本周匹配计划"
        confirmText="保存意愿"
        cancelText="稍后再说"
        onClose={() => setSignupOpen(false)}
        onConfirm={() => showToast("已保存本周意愿")}
      >
        <div className="space-y-3">
          <PreferenceBlock title="本周想参加" items={["1v1 匹配", "小组匹配", "都可以"]} />
          <PreferenceBlock title="期望氛围" items={["安静聊天", "轻松破冰", "轻散步"]} />
          <PreferenceBlock title="时间偏好" items={["周五晚", "周六下午", "周日白天"]} />
          <p className="text-xs leading-relaxed text-muted">
            AI 会尽力推荐合适安排，结果可能存在差异。
          </p>
        </div>
      </Modal>
    </div>
  );
}

function PreferenceBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <TagChip key={item} tone={index === 0 ? "coffee" : "plain"}>
            {item}
          </TagChip>
        ))}
      </div>
    </div>
  );
}

function CompactUserCard({ user, badge }: { user: UserCard; badge: string }) {
  return (
    <div className="w-[168px] shrink-0 rounded-[1.25rem] border border-line bg-white/92 p-3 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <AbstractAvatar seed={user.avatarSeed} label={user.alias} size="sm" />
        <StatusBadge tone={badge === "1v1" ? "ready" : "quiet"}>{badge}</StatusBadge>
      </div>
      <p className="mt-3 truncate text-sm font-black text-ink">{user.alias}</p>
      <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-relaxed text-muted">
        {user.bio}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {user.tags.slice(0, 2).map((tag, index) => (
          <TagChip key={tag} tone={index === 0 ? "coffee" : "plain"}>
            {tag}
          </TagChip>
        ))}
      </div>
    </div>
  );
}
