import { Send, ThumbsDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { cn } from "../components/common/utils";
import { TopBar } from "../components/layout/TopBar";
import { cardRecommendations } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const filters = ["全部", "高匹配", "适合慢慢聊"];

function statusText(status: string) {
  if (status === "request_sent") return "已发送，等待通过";
  if (status === "accepted") return "已成为好友";
  if (status === "ignored") return "已减少类似推荐";
  return "发送好友申请";
}

export function CardsPage() {
  const [filter, setFilter] = useState("全部");
  const { showToast } = useToast();
  const {
    cardRequestStatusMap,
    sendFriendRequest,
    acceptCardFriend,
    ignoreCard
  } = useDemoStore();

  const cards = useMemo(() => {
    return cardRecommendations.filter((user) => {
      const status = cardRequestStatusMap[user.id] ?? "default";
      if (filter === "高匹配") return user.matchScore >= 86 && status !== "ignored";
      if (filter === "适合慢慢聊") {
        return user.tags.some((tag) => tag.includes("慢热") || tag.includes("真诚"));
      }
      return true;
    });
  }, [cardRequestStatusMap, filter]);

  const requestFriend = (userId: string) => {
    sendFriendRequest(userId);
    showToast("好友申请已发送", "info");
    window.setTimeout(() => {
      acceptCardFriend(userId);
      showToast("对方已通过，你可以继续看卡片或去聊天");
    }, 1200);
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="可以先聊聊的人" subtitle="还不想立刻约见时，可以先轻量认识" />

      <Card className="space-y-2 bg-[#fffaf4]">
        <h1 className="text-xl font-black text-ink">每次只看少量适合轻量聊天的人</h1>
        <p className="text-sm leading-relaxed text-muted">
          这里不是刷人列表。AI 只保留与你的聊天节奏、咖啡偏好和边界感更接近的匿名卡片。
        </p>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <Button
            key={item}
            className="min-h-9 shrink-0 rounded-full px-3 py-1.5 text-xs"
            variant={filter === item ? "primary" : "secondary"}
            onClick={() => setFilter(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {cards.map((user) => {
          const status = cardRequestStatusMap[user.id] ?? "default";
          const ignored = status === "ignored";
          return (
            <Card
              key={user.id}
              className={cn(
                "space-y-4 transition",
                ignored && "opacity-60 grayscale-[0.25]"
              )}
            >
              <div className="flex items-start gap-3">
                <AbstractAvatar seed={user.avatarSeed} label={user.alias} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-black text-ink">{user.alias}</h2>
                    <StatusBadge tone={status === "accepted" ? "success" : "ready"}>
                      {user.matchScore}% 匹配
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {user.ageRange} · 北京 · 抽象头像
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink">{user.bio}</p>
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag, index) => (
                  <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
                    {tag}
                  </TagChip>
                ))}
              </div>
              <div className="rounded-[1.2rem] bg-cream p-3">
                <p className="text-xs font-bold text-coffee">AI 推荐理由</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{user.aiReason}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold text-muted">适合活动</p>
                <div className="flex flex-wrap gap-2">
                  {user.activityPreference.map((activity) => (
                    <TagChip key={activity} tone="lilac">
                      {activity}
                    </TagChip>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Button
                  loading={status === "request_sent"}
                  disabled={status === "accepted" || status === "ignored"}
                  icon={<Send className="h-4 w-4" />}
                  onClick={() => requestFriend(user.id)}
                >
                  {statusText(status)}
                </Button>
                <Button
                  className="h-11 w-11 px-0"
                  variant="secondary"
                  disabled={status !== "default"}
                  aria-label="不感兴趣"
                  icon={<ThumbsDown className="h-4 w-4" />}
                  onClick={() => {
                    ignoreCard(user.id);
                    showToast("AI 已记录你的反馈，将减少类似推荐", "info");
                  }}
                >
                  <span className="sr-only">不感兴趣</span>
                </Button>
              </div>
              {status === "accepted" ? (
                <Link to="/friends">
                  <Button className="w-full" variant="secondary">
                    去聊天
                  </Button>
                </Link>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
