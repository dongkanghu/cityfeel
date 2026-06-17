import { Bot } from "lucide-react";
import { AbstractAvatar } from "../common/AbstractAvatar";
import { StatusBadge } from "../common/StatusBadge";
import { cn } from "../common/utils";
import type { DemoConversation } from "../../data/conversations";

type ConversationListProps = {
  conversations: DemoConversation[];
  selectedId?: string | null;
  previews?: Record<string, string>;
  onSelect: (conversationId: string) => void;
};

export function ConversationList({
  conversations,
  selectedId,
  previews = {},
  onSelect
}: ConversationListProps) {
  return (
    <div className="grid gap-1.5">
      {conversations.map((conversation) => {
        const selected = conversation.id === selectedId;
        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-[1.2rem] px-3 py-2.5 text-left transition active:bg-oatmeal/80",
              selected ? "bg-white shadow-soft" : "bg-white/72"
            )}
          >
            {conversation.kind === "ai" ? (
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Bot className="h-5 w-5" />
              </div>
            ) : (
              <AbstractAvatar
                seed={conversation.avatarSeed ?? conversation.id}
                label={conversation.title}
                size="sm"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-black text-ink">{conversation.title}</p>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted">
                {previews[conversation.id] || conversation.subtitle}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusBadge
                className="px-2 py-0.5"
                tone={conversation.kind === "ai" ? "success" : "quiet"}
              >
                {conversation.sourceLabel}
              </StatusBadge>
              <span className="text-[11px] font-medium text-muted">{conversation.status}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
