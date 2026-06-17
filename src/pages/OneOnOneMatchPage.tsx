import { Coffee, EyeOff, MessageCircle, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Modal } from "../components/common/Modal";
import { StatusBadge } from "../components/common/StatusBadge";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import { ActivityCard } from "../components/match/ActivityCard";
import { AiReasonCard } from "../components/match/AiReasonCard";
import { UserProfileCard } from "../components/match/UserProfileCard";
import { ChatPanel } from "../components/chat/ChatPanel";
import {
  initialOneOnOneMessages,
  oneOnOneConversationId,
  oneOnOneUser,
  safetyNotes
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const quickReplies = [
  "我建议在地铁站出口集合",
  "可以先咖啡再轻散步",
  "我们把时间定在 15:00 吧",
  "我想换一个更安静的地点"
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
        onClick: () => navigate("/friends")
      };
    }
    return {
      label: "愿意见一面",
      disabled: false,
      loading,
      onClick: agree
    };
  })();

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="1v1 咖啡活动匹配" subtitle="北京 · 每周一次低压力推荐" />

      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-coffee">本周 1v1 咖啡匹配</p>
            <h1 className="mt-1 text-2xl font-black text-ink">胡同回声</h1>
            <p className="mt-1 text-sm text-muted">周六下午咖啡聊天 · 匹配度 91%</p>
          </div>
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
        <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] bg-white p-2 text-center">
          <div>
            <p className="text-lg font-black text-ink">91%</p>
            <p className="text-[11px] text-muted">匹配度</p>
          </div>
          <div>
            <p className="text-lg font-black text-ink">60-90</p>
            <p className="text-[11px] text-muted">分钟</p>
          </div>
          <div>
            <p className="text-lg font-black text-ink">北京</p>
            <p className="text-[11px] text-muted">默认城市</p>
          </div>
        </div>
        <div className="grid gap-2">
          <Button
            className="w-full"
            loading={primaryButton.loading}
            disabled={primaryButton.disabled}
            icon={<Coffee className="h-4 w-4" />}
            onClick={primaryButton.onClick}
          >
            {primaryButton.label}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              icon={<EyeOff className="h-4 w-4" />}
              disabled={oneOnOneStatus !== "recommended" && oneOnOneStatus !== "skipped"}
              onClick={() => {
                skipOneOnOne();
                showToast("已记录暂时跳过，仍可稍后重新同意", "info");
              }}
            >
              暂时跳过
            </Button>
            <Button
              variant="outline"
              icon={<MessageCircle className="h-4 w-4" />}
              onClick={() => showToast("AI 推荐理由已在下方展开", "info")}
            >
              推荐理由
            </Button>
          </div>
        </div>
      </Card>

      <UserProfileCard user={oneOnOneUser} badge="25-29 · 北京" />
      <AiReasonCard reason={oneOnOneUser.aiReason} />
      <ActivityCard
        title="咖啡聊天"
        time="本周六 15:00 - 16:30"
        location="三里屯、亮马河、五道营、国贸商圈"
      />

      <Card className="space-y-2 bg-[#f8fbf7]">
        <div className="flex items-center gap-2 text-sm font-black text-moss">
          <ShieldCheck className="h-4 w-4" />
          安全与匿名提示
        </div>
        <div className="space-y-1">
          {safetyNotes.map((note) => (
            <p key={note} className="text-xs leading-relaxed text-muted">
              {note}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="secondary" onClick={() => showToast("已记录屏蔽反馈", "info")}>
            屏蔽
          </Button>
          <Button variant="danger" onClick={() => showToast("已记录举报入口点击", "info")}>
            举报
          </Button>
        </div>
      </Card>

      {canChat ? (
        <>
          <Card className="space-y-3">
            <h2 className="text-base font-black text-ink">当前进度</h2>
            <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-semibold text-muted">
              {["已成为好友", "确认地点", "确认活动", "活动当天"].map((step, index) => (
                <div
                  key={step}
                  className={`rounded-2xl px-1.5 py-2 ${
                    oneOnOneStatus === "confirmed" || index < 2
                      ? "bg-[#e4f2ea] text-[#2f6d50]"
                      : "bg-cream"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </Card>
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
