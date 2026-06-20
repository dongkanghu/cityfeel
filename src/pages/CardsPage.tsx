import { Send, ThumbsDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { cn } from "../components/common/utils";
import { TopBar } from "../components/layout/TopBar";
import { cardRecommendations, type UserCard } from "../data/mock";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
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

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth;
    if (cardWidth === 0) return;
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="随时匹配" subtitle="左右滑动看下一位" showBack />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <Button
            key={item}
            className="min-h-9 shrink-0 rounded-full px-3 py-1.5 text-xs"
            variant={filter === item ? "primary" : "secondary"}
            onClick={() => {
              setFilter(item);
              setActiveIndex(0);
              scrollerRef.current?.scrollTo({ left: 0 });
            }}
          >
            {item}
          </Button>
        ))}
      </div>

      {cards.length === 0 ? (
        <Card className="text-center text-sm text-muted">
          这个筛选下暂时没有合适的人，换个筛选试试。
        </Card>
      ) : (
        <>
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((user) => (
              <SwipeUserCard
                key={user.id}
                user={user}
                status={cardRequestStatusMap[user.id] ?? "default"}
                onRequest={() => requestFriend(user.id)}
                onIgnore={() => {
                  ignoreCard(user.id);
                  showToast("AI 已记录你的反馈，将减少类似推荐", "info");
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            {cards.map((user, idx) => (
              <button
                key={user.id}
                type="button"
                aria-label={`第 ${idx + 1} 张`}
                onClick={() => scrollToIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === activeIndex ? "w-6 bg-coffee" : "w-1.5 bg-line"
                )}
              />
            ))}
          </div>

          <p className="text-center text-[11px] text-muted">
            {activeIndex + 1} / {cards.length}
          </p>
        </>
      )}
    </div>
  );
}

function SwipeUserCard({
  user,
  status,
  onRequest,
  onIgnore
}: {
  user: UserCard;
  status: string;
  onRequest: () => void;
  onIgnore: () => void;
}) {
  const ignored = status === "ignored";
  return (
    <div className="w-[calc(100vw-2rem)] max-w-[398px] shrink-0 snap-center">
      <Card
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
            onClick={onRequest}
          >
            {statusText(status)}
          </Button>
          <Button
            className="h-11 w-11 px-0"
            variant="secondary"
            disabled={status !== "default"}
            aria-label="不感兴趣"
            icon={<ThumbsDown className="h-4 w-4" />}
            onClick={onIgnore}
          >
            <span className="sr-only">不感兴趣</span>
          </Button>
        </div>
        {status === "accepted" ? (
          <Link to="/chat">
            <Button className="w-full" variant="secondary">
              去聊天
            </Button>
          </Link>
        ) : null}
      </Card>
    </div>
  );
}
