import { MapPin } from "lucide-react";
import type { ActivityLocation } from "../../data/mock";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { StatusBadge } from "../common/StatusBadge";

type LocationVoteCardProps = {
  locations: ActivityLocation[];
  votes: Record<string, number>;
  selectedLocationId: string | null;
  onVote: (locationId: string) => void;
};

export function LocationVoteCard({
  locations,
  votes,
  selectedLocationId,
  onVote
}: LocationVoteCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-coffee" />
          <h2 className="text-base font-black text-ink">地点投票</h2>
        </div>
        {selectedLocationId ? <StatusBadge tone="success">你已选择</StatusBadge> : null}
      </div>
      <div className="space-y-2">
        {locations.map((location) => {
          const selected = selectedLocationId === location.id;
          return (
            <div
              key={location.id}
              className="rounded-[1.2rem] border border-line bg-cream/70 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink">{location.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{location.reason}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-black text-coffee">
                  {votes[location.id] ?? 0} 票
                </span>
              </div>
              <Button
                className="mt-3 w-full"
                variant={selected ? "primary" : "secondary"}
                onClick={() => onVote(location.id)}
              >
                {selected ? "已选择该地点" : "选择这个地点"}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
