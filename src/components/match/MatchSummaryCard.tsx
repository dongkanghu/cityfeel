import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { StatusBadge } from "../common/StatusBadge";
import { cn } from "../common/utils";

type MatchSummaryCardProps = {
  title: string;
  status: string;
  score?: number;
  description: string;
  to: string;
  icon?: ReactNode;
  tone?: "ready" | "waiting" | "success" | "quiet";
  className?: string;
};

export function MatchSummaryCard({
  title,
  status,
  score,
  description,
  to,
  icon,
  tone = "ready",
  className
}: MatchSummaryCardProps) {
  return (
    <Link to={to} className="block">
      <Card className={cn("transition hover:-translate-y-0.5 hover:shadow-lift", className)}>
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-oatmeal text-coffee">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-black text-ink">{title}</h2>
              <StatusBadge tone={tone}>{status}</StatusBadge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            {score ? (
              <p className="mt-3 text-sm font-black text-coffee">匹配度 {score}%</p>
            ) : null}
          </div>
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted" />
        </div>
      </Card>
    </Link>
  );
}
