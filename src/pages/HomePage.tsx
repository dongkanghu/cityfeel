import {
  CalendarClock,
  ChevronRight,
  Coffee,
  History,
  Info,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Modal } from "../components/common/Modal";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import { cardRecommendations, currentUser, oneOnOneUser } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

function planStatusLabel(status: string, onboardingCompleted: boolean) {
  if (!onboardingCompleted) return "待了解偏好";
  if (status === "confirmed") return "活动已确认";
  if (status === "activity_confirming") return "请确认地点";
  if (status === "waiting_other") return "等待对方确认";
  return "待确认推荐";
}

function primaryAction(status: string, onboardingCompleted: boolean) {
  if (!onboardingCompleted) {
    return { label: "先回答几个问题", to: "/onboarding", disabled: false };
  }
  if (status === "waiting_other") {
    return { label: "已同意，等待对方确认", to: "/match/one-on-one", disabled: true };
  }
  if (status === "activity_confirming") {
    return { label: "确认时间和集合地点", to: "/match/one-on-one", disabled: false };
  }
  if (status === "confirmed") {
    return { label: "进入聊天", to: "/friends", disabled: false };
  }
  return { label: "查看并确认", to: "/match/one-on-one", disabled: false };
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
    cardRequestStatusMap
  } = useDemoStore();
  const action = primaryAction(oneOnOneStatus, onboardingCompleted);
  const newCards = cardRecommendations.filter(
    (user) => cardRequestStatusMap[user.id] === "default"
  ).length;
  const progress = onboardingCompleted ? profileProgress : 24;
  const tags = (selectedProfileTags.length ? selectedProfileTags : currentUser.tags).slice(0, 3);

  return (
    <div className="space-y-4 pt-1">
      <TopBar
        title="本周"
        subtitle="北京 · 本周匹配计划"
        right={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-muted shadow-sm"
              aria-label="查看历史和聊天"
              onClick={() => navigate("/friends")}
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

      <Card className="space-y-4 overflow-hidden bg-[#fffaf4]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-coffee">你今天只需要做一件事</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-ink">
              {onboardingCompleted
                ? "确认本周 1v1 匹配推荐"
                : "先让 AI 了解你的见面偏好"}
            </h1>
          </div>
          <StatusBadge tone={oneOnOneStatus === "confirmed" ? "success" : "waiting"}>
            {planStatusLabel(oneOnOneStatus, onboardingCompleted)}
          </StatusBadge>
        </div>

        <div className="rounded-[1.35rem] border border-line bg-white p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <TagChip tone="coffee">低压力</TagChip>
              <TagChip tone="sage">少量推荐</TagChip>
              <TagChip tone="plain">匿名开始</TagChip>
            </div>
            <span className="shrink-0 text-xs font-bold text-muted">北京</span>
          </div>
          <div className="grid gap-2 text-sm text-muted">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-coffee" />
              <span>周二 24:00 截止，周三 20:00 出结果</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-semibold">
              {["了解偏好", "本周推荐", "确认安排", "见面反馈"].map((step) => (
                <div key={step} className="rounded-full bg-cream px-1.5 py-1 text-muted">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>

        {onboardingCompleted ? (
          <div className="rounded-[1.35rem] bg-cream p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-muted">本周推荐对象</p>
                <p className="mt-1 text-lg font-black text-ink">{oneOnOneUser.alias}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  你们都偏好安静环境、低压力聊天和清楚边界。建议从周六下午一杯咖啡开始。
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

        <Button
          className="w-full justify-between"
          disabled={action.disabled}
          icon={<ChevronRight className="h-4 w-4" />}
          onClick={() => navigate(action.to)}
        >
          {action.label}
        </Button>
        <Button className="w-full" variant="ghost" onClick={() => setSignupOpen(true)}>
          调整本周意愿
        </Button>
      </Card>

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
              <p className="font-black text-ink">看看小组匹配</p>
              <p className="text-xs text-muted">
                {groupStatus === "available" ? "适合不想单独见面的人" : "已加入本周小组活动"}
              </p>
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
