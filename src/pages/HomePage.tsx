import { Coffee, CreditCard, MessageCircle, Sparkles, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { TopBar } from "../components/layout/TopBar";
import { MatchSummaryCard } from "../components/match/MatchSummaryCard";
import { cardRecommendations, currentUser } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

function oneOnOneLabel(status: string) {
  if (status === "confirmed") return "活动已确认";
  if (status === "activity_confirming") return "确认地点中";
  if (status === "waiting_other") return "等待对方";
  if (status === "skipped") return "已暂时跳过";
  return "待你确认";
}

function groupLabel(status: string) {
  if (status === "confirmed") return "已确认";
  if (status === "planning") return "地点投票中";
  if (status === "joined") return "已加入群聊";
  return "可加入";
}

export function HomePage() {
  const {
    profileProgress,
    selectedProfileTags,
    onboardingCompleted,
    oneOnOneStatus,
    groupStatus,
    cardRequestStatusMap
  } = useDemoStore();
  const newCards = cardRecommendations.filter(
    (user) => cardRequestStatusMap[user.id] === "default"
  ).length;
  const acceptedCards = cardRecommendations.filter(
    (user) => cardRequestStatusMap[user.id] === "accepted"
  ).length;
  const progress = onboardingCompleted ? profileProgress : 24;
  const tags = selectedProfileTags.length ? selectedProfileTags : currentUser.tags;

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="首页" subtitle="北京 · 本周咖啡轻社交" />

      <Card className="space-y-4 overflow-hidden bg-[#fffaf4]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">晚上好，{currentUser.alias}</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-ink">
              AI 已为你完成本周初步匹配
            </h1>
          </div>
          <StatusBadge tone="success">匿名模式开启</StatusBadge>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>画像完成度</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-oatmeal">
            <div
              className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 6).map((tag, index) => (
            <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <p className="text-xs text-muted">本周 1v1 咖啡名额</p>
          <p className="mt-1 text-lg font-black text-ink">1 / 1</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">多人咖啡局名额</p>
          <p className="mt-1 text-lg font-black text-ink">
            {groupStatus === "available" ? "0" : "1"} / 1
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">新推荐卡片</p>
          <p className="mt-1 text-lg font-black text-ink">{newCards}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted">好友申请自动通过</p>
          <p className="mt-1 text-lg font-black text-moss">开启</p>
        </Card>
      </div>

      <div className="space-y-3">
        <MatchSummaryCard
          title="1v1 咖啡匹配"
          status={oneOnOneLabel(oneOnOneStatus)}
          score={91}
          description="推荐对象：胡同回声 · 活动：周六下午咖啡聊天"
          to="/match/one-on-one"
          icon={<Coffee className="h-5 w-5" />}
          tone={oneOnOneStatus === "confirmed" ? "success" : "waiting"}
        />
        <MatchSummaryCard
          title="多 v 多咖啡局"
          status={groupLabel(groupStatus)}
          score={88}
          description="活动：3v3 北京咖啡轻社交局 · AI 推荐地点与小组流程"
          to="/match/group"
          icon={<UsersRound className="h-5 w-5" />}
          tone={groupStatus === "confirmed" ? "success" : "ready"}
        />
        <MatchSummaryCard
          title="AI 卡片推荐"
          status={acceptedCards > 0 ? `已新增 ${acceptedCards} 位好友` : `${newCards} 张新卡片`}
          description="与你的聊天节奏和咖啡偏好接近，可发起自动通过的好友申请"
          to="/cards"
          icon={<CreditCard className="h-5 w-5" />}
          tone="ready"
        />
      </div>

      <Card className="space-y-3 bg-[#f8fbf7]">
        <div className="flex items-center gap-2 text-sm font-black text-moss">
          <Sparkles className="h-4 w-4" />
          AI 本周建议
        </div>
        <p className="text-sm leading-relaxed text-muted">
          你更适合从低压力咖啡聊天开始建立连接。建议优先确认 1v1
          咖啡匹配；如果想降低单独见面的压力，可以选择 3v3 咖啡轻社交局。
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/onboarding">
            <Button className="w-full" variant="secondary" icon={<Sparkles className="h-4 w-4" />}>
              完善画像
            </Button>
          </Link>
          <Link to="/profile">
            <Button className="w-full" variant="outline" icon={<MessageCircle className="h-4 w-4" />}>
              匿名卡片
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
