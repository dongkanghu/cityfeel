import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import type { ChatMessage } from "../../data/mock";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { ChatBubble } from "./ChatBubble";
import { QuickReplies } from "./QuickReplies";

type ChatPanelProps = {
  title: string;
  subtitle?: string;
  messages: ChatMessage[];
  senderLabels?: Record<string, string>;
  quickReplies?: string[];
  placeholder?: string;
  onSend: (content: string) => void;
};

export function ChatPanel({
  title,
  subtitle,
  messages,
  senderLabels = {},
  quickReplies = [],
  placeholder = "输入一条消息",
  onSend
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");

  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onSend(value);
    setDraft("");
  };

  return (
    <Card className="space-y-3 p-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-black text-ink">{title}</h2>
          {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
        </div>
      </div>
      <div className="max-h-[430px] min-h-[260px] space-y-3 overflow-y-auto rounded-[1.25rem] bg-cream/70 p-3">
        {messages.length === 0 ? (
          <div className="grid h-40 place-items-center text-center text-sm text-muted">
            暂无消息，发送第一条咖啡话题吧。
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              senderName={senderLabels[message.sender]}
            />
          ))
        )}
      </div>
      <QuickReplies replies={quickReplies} onPick={onSend} />
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5">
        <input
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-muted/70"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
          }}
          placeholder={placeholder}
        />
        <Button
          aria-label="发送消息"
          className="h-10 min-h-10 w-10 rounded-xl px-0"
          icon={<SendHorizonal className="h-4 w-4" />}
          onClick={submit}
        >
          <span className="sr-only">发送</span>
        </Button>
      </div>
    </Card>
  );
}
