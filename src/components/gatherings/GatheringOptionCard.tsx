import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { StatusBadge } from "../common/StatusBadge";
import { TagChip } from "../common/TagChip";

type GatheringOptionCardProps = {
  title: string;
  subtitle: string;
  status: string;
  to: string;
  icon: ReactNode;
  score?: string;
  tags: string[];
  tone?: "ready" | "waiting" | "success" | "quiet";
};

export function GatheringOptionCard({
  title,
  subtitle,
  status,
  to,
  icon,
  score,
  tags,
  tone = "ready"
}: GatheringOptionCardProps) {
  return (
    <Link to={to} className="block">
      <Card className="space-y-3 transition hover:-translate-y-0.5 hover:shadow-lift">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-oatmeal text-coffee">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black text-ink">{title}</h2>
              <StatusBadge tone={tone}>{status}</StatusBadge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">{subtitle}</p>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap gap-2">
            {tags.map((tag, index) => (
              <TagChip key={tag} tone={index === 0 ? "coffee" : "plain"}>
                {tag}
              </TagChip>
            ))}
          </div>
          {score ? (
            <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-xs font-black text-coffee">
              {score}
            </span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
