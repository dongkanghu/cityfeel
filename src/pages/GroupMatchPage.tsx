import { CalendarCheck, Shuffle, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import { ChatPanel } from "../components/chat/ChatPanel";
import { AiReasonCard } from "../components/match/AiReasonCard";
import { LocationVoteCard } from "../components/match/LocationVoteCard";
import { UserProfileCard } from "../components/match/UserProfileCard";
import {
  groupActivity,
  groupConversationId,
  groupMembers,
  groupPlan,
  groupTopics,
  initialGroupMessages
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const groupQuickReplies = [
  "我也倾向亮马河",
  "我周日下午可以",
  "可以安排一个简单破冰问题",
  "我想先看大家的时间"
];

function groupStatusLabel(status: string) {
  if (status === "confirmed") return "已确认本周多人咖啡局";
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
      <TopBar title="小组活动匹配" subtitle="北京 · 3v3 咖啡轻社交局" />

      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-coffee">本周多人咖啡局</p>
            <h1 className="mt-1 text-2xl font-black text-ink">{groupActivity.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {groupActivity.timeSuggestion} · 匹配度 {groupActivity.matchScore}%
            </p>
          </div>
          <StatusBadge tone={groupStatus === "confirmed" ? "success" : "ready"}>
            {groupStatusLabel(groupStatus)}
          </StatusBadge>
        </div>
        <div className="rounded-[1.25rem] bg-white p-3">
          <p className="text-xs font-semibold text-muted">当前主题</p>
          <p className="mt-1 text-lg font-black text-ink">{groupTopics[groupTopicIndex]}</p>
        </div>
        <div className="grid gap-2">
          <Button
            className="w-full"
            disabled={groupStatus !== "available"}
            icon={<UsersRound className="h-4 w-4" />}
            onClick={join}
          >
            {groupStatus === "available" ? "加入本周咖啡局" : "已加入本周活动"}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              icon={<Shuffle className="h-4 w-4" />}
              onClick={() => {
                cycleGroupTopic();
                showToast("已切换一个活动主题", "info");
              }}
            >
              换主题
            </Button>
            <Button
              variant="outline"
              onClick={() => showToast("成员画像已展示在下方", "info")}
            >
              成员画像
            </Button>
          </div>
        </div>
      </Card>

      <AiReasonCard title="AI 活动建议" reason={groupActivity.aiReason} />

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-ink">当前小组：3v3</h2>
          <StatusBadge tone="quiet">6 人</StatusBadge>
        </div>
        <div className="grid gap-3">
          <div>
            <p className="mb-2 text-xs font-bold text-muted">我方</p>
            <div className="grid gap-2">
              {groupMembers.slice(0, 3).map((member) => (
                <UserProfileCard key={member.id} user={member} />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-muted">对方</p>
            <div className="grid gap-2">
              {groupMembers.slice(3).map((member) => (
                <UserProfileCard key={member.id} user={member} />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {showGroupChat ? (
        <>
          <ChatPanel
            title="3v3 北京咖啡轻社交局"
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
