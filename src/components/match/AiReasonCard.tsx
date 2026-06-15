import { Sparkles } from "lucide-react";
import { Card } from "../common/Card";

type AiReasonCardProps = {
  title?: string;
  reason: string;
};

export function AiReasonCard({ title = "AI 推荐理由", reason }: AiReasonCardProps) {
  return (
    <Card className="space-y-2 bg-[#fffaf4]">
      <div className="flex items-center gap-2 text-coffee">
        <Sparkles className="h-4 w-4" />
        <h2 className="text-sm font-black">{title}</h2>
      </div>
      <p className="text-sm leading-relaxed text-muted">{reason}</p>
    </Card>
  );
}
