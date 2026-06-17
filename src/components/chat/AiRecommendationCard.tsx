import { Check, X } from "lucide-react";
import type { CardStatus, UserCard } from "../../data/mock";
import { AbstractAvatar } from "../common/AbstractAvatar";
import { Button } from "../common/Button";
import { StatusBadge } from "../common/StatusBadge";
import { TagChip } from "../common/TagChip";

type AiRecommendationCardProps = {
  user: UserCard;
  status: CardStatus;
  onAccept: () => void;
  onDismiss: () => void;
};

function statusCopy(status: CardStatus) {
  if (status === "request_sent") return "正在等待对方自动通过";
  if (status === "accepted") return "已接受，已放入聊天列表";
  if (status === "ignored") return "已取消，明天 10:00 再更新";
  return "查看当前推荐，可以接受或取消";
}

export function AiRecommendationCard({
  user,
  status,
  onAccept,
  onDismiss
}: AiRecommendationCardProps) {
  const inactive = status === "accepted" || status === "ignored";

  return (
    <div className="space-y-3 rounded-[1.25rem] border border-[#eadfce] bg-[#fffaf4] p-3">
      <div className="flex items-start gap-3">
        <AbstractAvatar seed={user.avatarSeed} label={user.alias} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-ink">今日卡片推荐</p>
            <StatusBadge tone="ready">{user.matchScore}%</StatusBadge>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {statusCopy(status)} · 每天 10:00 更新
          </p>
        </div>
      </div>

      <div className="rounded-[1.1rem] bg-white/78 p-3">
        <p className="text-sm font-bold text-ink">{user.alias}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{user.aiReason}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {user.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} tone="plain">
              {tag}
            </TagChip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          className="min-h-10 rounded-xl text-xs"
          loading={status === "request_sent"}
          disabled={inactive}
          icon={<Check className="h-4 w-4" />}
          onClick={onAccept}
        >
          {status === "accepted" ? "已接受" : "接受推荐"}
        </Button>
        <Button
          className="min-h-10 rounded-xl text-xs"
          variant="secondary"
          disabled={status !== "default"}
          icon={<X className="h-4 w-4" />}
          onClick={onDismiss}
        >
          {status === "ignored" ? "已取消" : "取消"}
        </Button>
      </div>
    </div>
  );
}
