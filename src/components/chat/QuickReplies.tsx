import { Button } from "../common/Button";

type QuickRepliesProps = {
  replies: string[];
  onPick: (reply: string) => void;
};

export function QuickReplies({ replies, onPick }: QuickRepliesProps) {
  if (replies.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {replies.map((reply) => (
        <Button
          key={reply}
          className="min-h-9 shrink-0 rounded-full px-3 py-1.5 text-xs"
          variant="secondary"
          onClick={() => onPick(reply)}
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
