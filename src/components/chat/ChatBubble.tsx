import type { ChatMessage } from "../../data/mock";
import { cn } from "../common/utils";

type ChatBubbleProps = {
  message: ChatMessage;
  senderName?: string;
};

export function ChatBubble({ message, senderName }: ChatBubbleProps) {
  const isMe = message.sender === "me";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <div className="mx-auto max-w-[92%] rounded-full bg-oatmeal px-3 py-1.5 text-center text-[11px] text-muted">
        {message.content}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
      <span className="px-1 text-[11px] text-muted">
        {isMe ? "我" : senderName ?? "匿名用户"} · {message.createdAt}
      </span>
      <div
        className={cn(
          "max-w-[82%] rounded-3xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isMe
            ? "rounded-br-lg bg-ink text-white"
            : "rounded-bl-lg border border-line bg-white text-ink"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
