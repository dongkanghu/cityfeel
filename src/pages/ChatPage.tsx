import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AiRecommendationCard } from "../components/chat/AiRecommendationCard";
import { TopBar } from "../components/layout/TopBar";
import { ChatPanel } from "../components/chat/ChatPanel";
import { ConversationList } from "../components/chat/ConversationList";
import { useToast } from "../components/common/Toast";
import {
  chatPageConversationSeeds,
  chatSenderLabels,
  demoConversations,
  todayRecommendationConversation,
  todayRecommendationUser,
  type DemoConversation
} from "../data/conversations";
import type { ChatMessage } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const CHAT_STORAGE_KEY = "cityfeel-demo-chat-page-v1";

function createMessage(
  conversationId: string,
  sender: string,
  content: string
): ChatMessage {
  return {
    id: `${conversationId}_${sender}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    conversationId,
    sender,
    content,
    createdAt: "刚刚"
  };
}

function initialConversationMessages() {
  return Object.fromEntries(
    chatPageConversationSeeds.map((conversation) => [
      conversation.id,
      conversation.initialMessages
    ])
  );
}

function readStoredMessages() {
  if (typeof window === "undefined") {
    return initialConversationMessages();
  }

  const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
  if (!raw) {
    return initialConversationMessages();
  }

  try {
    return {
      ...initialConversationMessages(),
      ...(JSON.parse(raw) as Record<string, ChatMessage[]>)
    };
  } catch {
    return initialConversationMessages();
  }
}

export function ChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, ChatMessage[]>
  >(() => readStoredMessages());

  const {
    cardRequestStatusMap,
    sendFriendRequest,
    acceptCardFriend,
    ignoreCard
  } = useDemoStore();
  const { showToast } = useToast();

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messagesByConversation));
  }, [messagesByConversation]);

  const todayRecommendationStatus =
    cardRequestStatusMap[todayRecommendationUser.id] ?? "default";

  const visibleConversations = useMemo(
    () =>
      todayRecommendationStatus === "accepted"
        ? [...demoConversations, todayRecommendationConversation]
        : demoConversations,
    [todayRecommendationStatus]
  );

  const selected = useMemo<DemoConversation | null>(
    () =>
      activeConversationId
        ? visibleConversations.find(
            (conversation) => conversation.id === activeConversationId
          ) ?? null
        : null,
    [activeConversationId, visibleConversations]
  );

  const messagePreviews = useMemo(
    () =>
      Object.fromEntries(
        visibleConversations.map((conversation) => {
          const messages = messagesByConversation[conversation.id] ?? conversation.initialMessages;
          const last = messages[messages.length - 1];
          return [conversation.id, last?.content ?? conversation.subtitle];
        })
      ),
    [messagesByConversation, visibleConversations]
  );

  const acceptTodayRecommendation = () => {
    if (todayRecommendationStatus !== "default") return;

    sendFriendRequest(todayRecommendationUser.id);
    showToast("已接受今日推荐，正在模拟对方通过", "info");
    window.setTimeout(() => {
      acceptCardFriend(todayRecommendationUser.id);
      showToast("对方已通过，已放入聊天列表");
      setActiveConversationId(todayRecommendationConversation.id);
    }, 900);
  };

  const dismissTodayRecommendation = () => {
    if (todayRecommendationStatus !== "default") return;

    ignoreCard(todayRecommendationUser.id);
    showToast("已取消今日推荐，明天 10:00 再更新", "info");
  };

  const sendMessage = (content: string) => {
    if (!selected) return;
    const trimmed = content.trim();
    if (!trimmed) return;

    setMessagesByConversation((current) => ({
      ...current,
      [selected.id]: [
        ...(current[selected.id] ?? selected.initialMessages),
        createMessage(selected.id, "me", trimmed)
      ]
    }));

    window.setTimeout(() => {
      setMessagesByConversation((current) => ({
        ...current,
        [selected.id]: [
          ...(current[selected.id] ?? selected.initialMessages),
          createMessage(selected.id, selected.replySender, selected.autoReply)
        ]
      }));
    }, 700);
  };

  if (selected) {
    return (
      <div className="space-y-3 pt-1">
        <header className="sticky top-0 z-20 -mx-4 border-b border-line/70 bg-cream/92 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="返回聊天列表"
              onClick={() => setActiveConversationId(null)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-muted shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-ink">{selected.title}</h1>
              <p className="mt-0.5 truncate text-xs text-muted">{selected.profileLine}</p>
            </div>
          </div>
        </header>

        <ChatPanel
          title={selected.title}
          subtitle={selected.profileLine}
          showHeader={false}
          className="min-h-[calc(100vh-11.5rem)]"
          messagesClassName="max-h-[calc(100vh-22rem)] min-h-[360px]"
          messages={messagesByConversation[selected.id] ?? selected.initialMessages}
          senderLabels={chatSenderLabels}
          quickReplies={selected.quickReplies}
          placeholder={
            selected.kind === "ai" ? "告诉 AI 你的偏好变化" : "输入一条轻松消息"
          }
          topSlot={
            selected.kind === "ai" ? (
              <AiRecommendationCard
                user={todayRecommendationUser}
                status={todayRecommendationStatus}
                onAccept={acceptTodayRecommendation}
                onDismiss={dismissTodayRecommendation}
              />
            ) : undefined
          }
          onSend={sendMessage}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="聊天" subtitle="点开一个会话进入独立聊天框" />

      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto rounded-[1.35rem] border border-line bg-white/58 p-1.5">
        <ConversationList
          conversations={visibleConversations}
          selectedId={activeConversationId}
          previews={messagePreviews}
          onSelect={setActiveConversationId}
        />
      </div>
    </div>
  );
}
