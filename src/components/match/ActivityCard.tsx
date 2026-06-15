import { CalendarDays, MapPin, ShieldCheck, Timer } from "lucide-react";
import { Card } from "../common/Card";

type ActivityCardProps = {
  title: string;
  time: string;
  location: string;
  budget?: string;
  safety?: string;
};

export function ActivityCard({
  title,
  time,
  location,
  budget = "人均 40-80 元",
  safety = "请选择公共场所，首次见面不建议透露住址或私人联系方式。"
}: ActivityCardProps) {
  const rows = [
    { icon: CalendarDays, label: "活动主题", value: title },
    { icon: Timer, label: "时间建议", value: time },
    { icon: MapPin, label: "建议区域", value: location },
    { icon: ShieldCheck, label: "安全建议", value: safety }
  ];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-ink">活动安排</h2>
        <span className="rounded-full bg-oatmeal px-3 py-1 text-xs font-semibold text-coffee">
          {budget}
        </span>
      </div>
      <div className="space-y-2">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex gap-2 rounded-2xl bg-cream p-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-coffee" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted">{row.label}</p>
                <p className="text-sm leading-relaxed text-ink">{row.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
