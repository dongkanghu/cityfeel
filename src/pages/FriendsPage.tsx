import { MessageCircle, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { TopBar } from "../components/layout/TopBar";
import { ChatPanel } from "../components/chat/ChatPanel";
import {
  cardRecommendations,
  groupConversationId,
  groupMembers,
  oneOnOneUser
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

type Tab = "friends" | "groups" | "activities";

type ConversationItem = {
  id: string;
  title: string;
  subtitle: string;
  avatarSeed?: string;
  status: string;
  type: "friend" | "group";
};

const tabs: Array<{ key: Tab; label: string }> = [
  { key: "friends", label: "全部聊天" },
  { key: "groups", label: "活动群聊" },
  { key: "activities", label: "待确认活动" }
];

function sourceLabel(source: string) {
  if (source === "one_on_one") return "1v1 咖啡匹配";
  if (source === "group") return "3v3 咖啡局";
  return "AI 卡片推荐";
}

export function FriendsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("friends");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { friends, groupStatus, chats, sendMessage } = useDemoStore();

  const groupConversation: ConversationItem | null =
    groupStatus === "available"
      ? null
      : {
          id: groupConversationId,
          title: "3v3 北京咖啡轻社交局",
          subtitle: "成员 6 人 · 北京咖啡活动",
          status: groupStatus === "confirmed" ? "活动已确认" : "地点投票中",
          type: "group"
        };

  const friendConversations: ConversationItem[] = friends.map((friend) => ({
    id: friend.conversationId,
    title: friend.alias,
    subtitle: sourceLabel(friend.source),
    avatarSeed: friend.avatarSeed,
    status: friend.status,
    type: "friend"
  }));

  const activeList = useMemo(() => {
    if (tab === "groups") return groupConversation ? [groupConversation] : [];
    if (tab === "activities") {
      return [
        ...friendConversations.filter((item) => item.status.includes("活动")),
        ...(groupConversation ? [groupConversation] : [])
      ];
    }
    return friendConversations;
  }, [friendConversations, groupConversation, tab]);

  useEffect(() => {
    if (!activeList.length) {
      setActiveId(null);
      return;
    }
    if (!activeId || !activeList.some((item) => item.id === activeId)) {
      setActiveId(activeList[0].id);
    }
  }, [activeId, activeList]);

  const selected = activeList.find((item) => item.id === activeId) ?? activeList[0];
  const senderLabels = useMemo(() => {
    const labels: Record<string, string> = {
      [oneOnOneUser.id]: oneOnOneUser.alias
    };
    for (const user of cardRecommendations) labels[user.id] = user.alias;
    for (const user of groupMembers) labels[user.id] = user.alias;
    return labels;
  }, []);

  const sendAndReply = (conversationId: string, content: string) => {
    sendMessage(conversationId, content);
    window.setTimeout(() => {
      const replySender =
        conversationId === groupConversationId ? "system" : oneOnOneUser.id;
      const reply =
        conversationId === groupConversationId
          ? "活动信息已更新。"
          : "哈哈这个话题我也很喜欢。";
      sendMessage(conversationId, reply, replySender);
    }, 900);
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="聊天" subtitle="匹配后再进入沟通和活动确认" />

      <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] bg-oatmeal p-1">
        {tabs.map((item) => (
          <Button
            key={item.key}
            className="min-h-9 rounded-[1rem] px-2 py-1.5 text-xs"
            variant={tab === item.key ? "primary" : "ghost"}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {activeList.length === 0 ? (
        <Card className="space-y-4 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-oatmeal text-coffee">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-ink">还没有会话</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              完成 1v1 匹配、加入多人咖啡局或发送卡片好友申请后，会话会出现在这里。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => navigate("/match/one-on-one")}>
              去匹配
            </Button>
            <Button onClick={() => navigate("/cards")}>看卡片</Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {activeList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`min-w-[180px] rounded-[1.25rem] border p-3 text-left transition ${
                  selected?.id === item.id
                    ? "border-coffee bg-white shadow-soft"
                    : "border-line bg-white/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.type === "group" ? (
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-oatmeal text-coffee">
                      <UsersRound className="h-5 w-5" />
                    </div>
                  ) : (
                    <AbstractAvatar
                      seed={item.avatarSeed ?? item.id}
                      label={item.title}
                      size="sm"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-ink">{item.title}</p>
                    <p className="truncate text-xs text-muted">{item.subtitle}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <StatusBadge tone={item.status.includes("确认") ? "success" : "waiting"}>
                    {item.status}
                  </StatusBadge>
                </div>
              </button>
            ))}
          </div>

          {selected ? (
            <>
              <Card className="flex flex-wrap gap-2 bg-[#fffaf4]">
                <TagChip tone="coffee">{selected.subtitle}</TagChip>
                <TagChip tone="sage">{selected.status}</TagChip>
                <TagChip tone="plain">北京</TagChip>
              </Card>
              <ChatPanel
                title={selected.title}
                subtitle={selected.subtitle}
                messages={chats[selected.id] ?? []}
                senderLabels={senderLabels}
                quickReplies={
                  selected.type === "group"
                    ? ["我也倾向亮马河", "周日下午可以", "我想看大家时间"]
                    : ["可以先咖啡再轻散步", "这个话题我也喜欢", "我们先定 15:00 吧"]
                }
                onSend={(content) => sendAndReply(selected.id, content)}
              />
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
