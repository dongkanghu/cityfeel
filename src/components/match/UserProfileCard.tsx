import type { UserCard } from "../../data/mock";
import { AbstractAvatar } from "../common/AbstractAvatar";
import { Card } from "../common/Card";
import { StatusBadge } from "../common/StatusBadge";
import { TagChip } from "../common/TagChip";

type UserProfileCardProps = {
  user: UserCard;
  badge?: string;
};

export function UserProfileCard({ user, badge }: UserProfileCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <AbstractAvatar seed={user.avatarSeed} label={user.alias} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-ink">{user.alias}</h2>
            {badge ? <StatusBadge tone="ready">{badge}</StatusBadge> : null}
          </div>
          <p className="mt-1 text-xs text-muted">
            {user.ageRange} · {user.city}
          </p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-ink">{user.bio}</p>
      <div className="flex flex-wrap gap-2">
        {user.tags.map((tag, index) => (
          <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
            {tag}
          </TagChip>
        ))}
      </div>
    </Card>
  );
}
