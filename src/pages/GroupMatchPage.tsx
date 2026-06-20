import { CalendarCheck, Shuffle, UsersRound } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { cn } from "../components/common/utils";
import { TopBar } from "../components/layout/TopBar";
import { ChatPanel } from "../components/chat/ChatPanel";
import { AiReasonCard } from "../components/match/AiReasonCard";
import { LocationVoteCard } from "../components/match/LocationVoteCard";
import {
  groupActivity,
  groupConversationId,
  groupMembers,
  groupPlan,
  groupTopics,
  initialGroupMessages,
  type UserCard
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const groupQuickReplies = [
  "我也倾向亮马河",
  "我周日下午可以",
  "可以安排一个简单破冰问题",
  "我想先看大家的时间"
];

function groupStatusLabel(status: string) {
  if (status === "confirmed") return "已确认本周活动";
  if (status === "planning") return "地点投票中";
  if (status === "joined") return "已加入群聊";
  return "等待你加入";
}

export function GroupMatchPage() {
  const { showToast } = useToast();
  const {
    groupStatus,
    groupTopicIndex,
    locationVotes,
    selectedLocationId,
    joinGroupActivity,
    cycleGroupTopic,
    voteLocation,
    confirmGroupActivity,
    chats,
    sendMessage
  } = useDemoStore();
  const messages = chats[groupConversationId] ?? initialGroupMessages;
  const showGroupChat = groupStatus !== "available";
  const senderLabels = useMemo(
    () =>
      Object.fromEntries(groupMembers.map((member) => [member.id, member.alias])) as Record<
        string,
        string
      >,
    []
  );

  const join = () => {
    joinGroupActivity();
    showToast("已加入活动群聊");
  };

  const sendAndReply = (content: string) => {
    sendMessage(groupConversationId, content);
    window.setTimeout(() => {
      sendMessage(groupConversationId, "我也觉得这个安排比较轻松。", "u_orange_americano");
    }, 900);
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="本周主题局" showBack />

      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-coffee">本周主题</p>
            <h1 className="mt-1 truncate text-xl font-black text-ink">
              {groupTopics[groupTopicIndex]}
            </h1>
            <p className="mt-1 text-xs text-muted">
              {groupActivity.timeSuggestion} · 匹配度 {groupActivity.matchScore}%
            </p>
          </div>
          <StatusBadge tone={groupStatus === "confirmed" ? "success" : "ready"}>
            {groupStatusLabel(groupStatus)}
          </StatusBadge>
        </div>
        <Button
          className="w-full"
          disabled={groupStatus !== "available"}
          icon={<UsersRound className="h-4 w-4" />}
          onClick={join}
        >
          {groupStatus === "available" ? "加入本周活动" : "已加入本周活动"}
        </Button>
        {groupStatus === "available" ? (
          <button
            type="button"
            onClick={() => {
              cycleGroupTopic();
              showToast("已切换一个活动主题", "info");
            }}
            className="-mt-1 flex w-full items-center justify-center gap-1 text-xs text-muted underline-offset-2 hover:underline"
          >
            <Shuffle className="h-3.5 w-3.5" />
            换一个主题
          </button>
        ) : null}
      </Card>

      <AiReasonCard title="AI 推荐理由" reason={groupActivity.aiReason} />

      <MembersSwiper members={groupMembers} />

      {showGroupChat ? (
        <>
          <ChatPanel
            title="活动群聊"
            subtitle={
              groupStatus === "confirmed" ? "活动已确认" : "群聊已开启，正在确认地点"
            }
            messages={messages}
            senderLabels={senderLabels}
            quickReplies={groupQuickReplies}
            onSend={sendAndReply}
          />
          <LocationVoteCard
            locations={groupActivity.locationSuggestions}
            votes={locationVotes}
            selectedLocationId={selectedLocationId}
            onVote={(locationId) => {
              voteLocation(locationId);
              showToast("地点投票已更新");
            }}
          />
          <Card className="space-y-3 bg-[#f8fbf7]">
            <h2 className="text-base font-black text-ink">AI 建议流程</h2>
            <div className="space-y-2">
              {groupPlan.map((item) => (
                <div key={item} className="rounded-2xl bg-white px-3 py-2 text-sm text-muted">
                  {item}
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              disabled={groupStatus === "confirmed"}
              icon={<CalendarCheck className="h-4 w-4" />}
              onClick={() => {
                confirmGroupActivity();
                showToast("已确认加入该安排");
              }}
            >
              {groupStatus === "confirmed" ? "已确认该安排" : "确认加入该安排"}
            </Button>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function MembersSwiper({ members }: { members: UserCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth;
    if (cardWidth === 0) return;
    const idx = Math.round(el.scrollLeft / cardWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black text-ink">本期同行的人</h2>
        <span className="text-xs text-muted">
          {activeIndex + 1} / {members.length}
        </span>
      </div>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {members.map((member) => (
          <div
            key={member.id}
            className="w-[calc(100vw-2rem)] max-w-[398px] shrink-0 snap-center"
          >
            <Card className="space-y-3">
              <div className="flex items-start gap-3">
                <AbstractAvatar seed={member.avatarSeed} label={member.alias} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-black text-ink">{member.alias}</h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {member.ageRange} · {member.city}
                  </p>
                </div>
              </div>
              <p className="line-clamp-2 text-sm leading-relaxed text-ink">{member.bio}</p>
              <div className="flex flex-wrap gap-2">
                {member.tags.slice(0, 3).map((tag, index) => (
                  <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
                    {tag}
                  </TagChip>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5">
        {members.map((member, idx) => (
          <span
            key={member.id}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === activeIndex ? "w-5 bg-coffee" : "w-1.5 bg-line"
            )}
          />
        ))}
      </div>
    </div>
  );
}
