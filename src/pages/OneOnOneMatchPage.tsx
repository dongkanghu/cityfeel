import { CalendarDays, Coffee, MapPin, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Modal } from "../components/common/Modal";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import { ChatPanel } from "../components/chat/ChatPanel";
import {
  initialOneOnOneMessages,
  oneOnOneConversationId,
  oneOnOneUser
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const quickReplies = [
  "我建议在地铁站出口集合",
  "可以先咖啡再轻散步",
  "我们把时间定在 15:00 吧"
];

function statusLabel(status: string) {
  if (status === "waiting_other") return "等待对方确认";
  if (status === "activity_confirming") return "活动确认中";
  if (status === "confirmed") return "活动已确认";
  if (status === "skipped") return "已暂时跳过";
  return "等待你确认";
}

export function OneOnOneMatchPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    oneOnOneStatus,
    startOneOnOneWaiting,
    resolveOneOnOneAccepted,
    confirmOneOnOneActivity,
    skipOneOnOne,
    chats,
    sendMessage
  } = useDemoStore();
  const messages = chats[oneOnOneConversationId] ?? initialOneOnOneMessages;
  const canChat =
    oneOnOneStatus === "activity_confirming" || oneOnOneStatus === "confirmed";

  useEffect(() => {
    if (oneOnOneStatus !== "waiting_other") {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(() => {
      resolveOneOnOneAccepted();
      showToast("对方也已同意，已自动添加为好友");
      setLoading(false);
    }, 1300);
    return () => window.clearTimeout(timer);
  }, [oneOnOneStatus, resolveOneOnOneAccepted, showToast]);

  const senderLabels = useMemo(
    () => ({
      [oneOnOneUser.id]: oneOnOneUser.alias
    }),
    []
  );

  const agree = () => {
    showToast("已同意本次 1v1 匹配，正在等待对方确认", "info");
    startOneOnOneWaiting();
  };

  const sendAndReply = (content: string) => {
    sendMessage(oneOnOneConversationId, content);
    window.setTimeout(() => {
      sendMessage(oneOnOneConversationId, "可以，那我们就先定这个地点吧。", oneOnOneUser.id);
    }, 900);
  };

  const confirmActivity = () => {
    confirmOneOnOneActivity();
    showToast("活动已确认，你可以在好友页继续沟通细节");
  };

  const primaryButton = (() => {
    if (oneOnOneStatus === "waiting_other") {
      return {
        label: "已同意，等待对方确认",
        disabled: true,
        loading: true,
        onClick: () => undefined
      };
    }
    if (oneOnOneStatus === "activity_confirming") {
      return {
        label: "确认时间和集合地点",
        disabled: false,
        loading: false,
        onClick: () => setConfirmOpen(true)
      };
    }
    if (oneOnOneStatus === "confirmed") {
      return {
        label: "进入聊天",
        disabled: false,
        loading: false,
        onClick: () => navigate("/chat")
      };
    }
    return {
      label: "愿意见一面",
      disabled: false,
      loading,
      onClick: agree
    };
  })();

  const canSkip = oneOnOneStatus === "recommended" || oneOnOneStatus === "skipped";

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="本周 1v1" showBack />

      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-center gap-3">
          <AbstractAvatar seed={oneOnOneUser.avatarSeed} label={oneOnOneUser.alias} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-black text-ink">{oneOnOneUser.alias}</h1>
              <StatusBadge
                tone={
                  oneOnOneStatus === "confirmed"
                    ? "success"
                    : oneOnOneStatus === "waiting_other"
                      ? "waiting"
                      : "ready"
                }
              >
                {statusLabel(oneOnOneStatus)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-xs text-muted">
              {oneOnOneUser.ageRange} · 北京 · 匹配度 91%
            </p>
          </div>
        </div>
        <Button
          className="w-full"
          loading={primaryButton.loading}
          disabled={primaryButton.disabled}
          icon={<Coffee className="h-4 w-4" />}
          onClick={primaryButton.onClick}
        >
          {primaryButton.label}
        </Button>
        {canSkip ? (
          <button
            type="button"
            onClick={() => {
              skipOneOnOne();
              showToast("已记录暂时跳过，仍可稍后重新同意", "info");
            }}
            className="-mt-1 w-full text-center text-xs text-muted underline-offset-2 hover:underline"
          >
            暂时跳过这一位
          </button>
        ) : null}
      </Card>

      <Card className="space-y-3">
        <p className="text-sm leading-relaxed text-ink">{oneOnOneUser.bio}</p>
        <div className="flex flex-wrap gap-2">
          {oneOnOneUser.tags.slice(0, 4).map((tag, index) => (
            <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))}
        </div>
        <div className="rounded-[1.2rem] bg-cream p-3">
          <p className="text-xs font-bold text-coffee">AI 推荐理由</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{oneOnOneUser.aiReason}</p>
        </div>
      </Card>

      <Card className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-coffee" />
          <h2 className="text-sm font-black text-ink">本周咖啡建议</h2>
        </div>
        <p className="text-sm text-ink">本周六 15:00 - 16:30</p>
        <div className="flex items-start gap-1.5 text-xs text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>三里屯 / 亮马河 / 五道营 / 国贸 任选，确认后由你们聊天商定</span>
        </div>
      </Card>

      {canChat ? (
        <>
          <ChatPanel
            title="集合地点沟通"
            subtitle={
              oneOnOneStatus === "confirmed"
                ? "活动已确认，可继续沟通细节"
                : "双方已同意，自动成为好友"
            }
            messages={messages}
            senderLabels={senderLabels}
            quickReplies={quickReplies}
            onSend={sendAndReply}
          />
          <Button
            className="w-full"
            disabled={oneOnOneStatus === "confirmed"}
            onClick={() => setConfirmOpen(true)}
          >
            {oneOnOneStatus === "confirmed" ? "活动已确认" : "确认活动"}
          </Button>
        </>
      ) : null}

      <div className="flex items-start gap-2 px-1 pb-1 text-[11px] leading-relaxed text-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" />
        <span>平台匿名，请选择公共场所首次见面，不展示真实姓名与联系方式。</span>
      </div>

      <Modal
        open={confirmOpen}
        title="确认本次 1v1 咖啡活动？"
        confirmText="确认活动"
        onConfirm={confirmActivity}
        onClose={() => setConfirmOpen(false)}
      >
        <div className="space-y-2">
          <p>时间：本周六 15:00</p>
          <p>集合地点：三里屯附近地铁站出口</p>
          <p>活动：咖啡聊天</p>
        </div>
      </Modal>
    </div>
  );
}
