import { Card } from "../common/Card";
import { TagChip } from "../common/TagChip";

type ProgressCardProps = {
  progress: number;
  tags: string[];
};

export function ProgressCard({ progress, tags }: ProgressCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-coffee">匿名画像</p>
          <h2 className="text-lg font-black text-ink">AI 画像完成度</h2>
        </div>
        <span className="text-2xl font-black text-ink">{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-oatmeal">
        <div
          className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <TagChip key={`${tag}-${index}`} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))
        ) : (
          <p className="text-sm text-muted">回答几个轻松问题后，AI 会逐步生成标签。</p>
        )}
      </div>
    </Card>
  );
}
