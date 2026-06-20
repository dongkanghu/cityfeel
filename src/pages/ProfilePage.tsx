import { RefreshCcw, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { TagChip } from "../components/common/TagChip";
import { TopBar } from "../components/layout/TopBar";
import { currentUser, profileSummary } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

function creditLevel(score: number) {
  if (score >= 110) return "金牌靠谱";
  if (score >= 100) return "守约稳定";
  if (score >= 85) return "正常";
  return "需注意";
}

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    selectedProfileTags,
    profileProgress,
    onboardingCompleted,
    creditScore,
    creditEvents
  } = useDemoStore();
  const tags = (selectedProfileTags.length ? selectedProfileTags : currentUser.tags).slice(0, 6);
  const progress = onboardingCompleted
    ? profileProgress || currentUser.profileCompleteness
    : profileProgress;

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="我" />

      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-center gap-3">
          <AbstractAvatar seed={currentUser.avatarSeed} label={currentUser.alias} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-black text-ink">{currentUser.alias}</h1>
            <p className="mt-1 text-xs text-muted">匿名昵称 · 北京</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-coffee" />
              AI 已了解
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-oatmeal">
            <div
              className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-coffee">信用分</p>
          <span className="rounded-full bg-oatmeal px-2 py-0.5 text-[11px] font-bold text-coffee">
            {creditLevel(creditScore)}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-black text-ink leading-none">{creditScore}</p>
          <p className="pb-1 text-xs text-muted">满分 120</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-oatmeal">
          <div
            className="h-full rounded-full bg-gradient-to-r from-moss to-sage"
            style={{ width: `${Math.min(100, (creditScore / 120) * 100)}%` }}
          />
        </div>
        <ul className="space-y-1.5 pt-1">
          {creditEvents.slice(0, 3).map((event) => (
            <li key={event.id} className="flex items-center gap-2 text-xs text-muted">
              <TrendingUp className="h-3.5 w-3.5 text-coffee" />
              <span className="flex-1 truncate">{event.reason}</span>
              <span className="text-[11px]">{event.createdAt}</span>
              <span
                className={
                  event.delta >= 0
                    ? "w-10 text-right font-bold text-moss"
                    : "w-10 text-right font-bold text-clay"
                }
              >
                {event.delta >= 0 ? `+${event.delta}` : event.delta}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="space-y-3">
        <p className="text-xs font-semibold text-coffee">AI 这样理解你</p>
        <p className="text-sm leading-relaxed text-ink">{profileSummary}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag, index) => (
            <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))}
        </div>
      </Card>

      <Button
        className="w-full"
        variant="secondary"
        icon={<RefreshCcw className="h-4 w-4" />}
        onClick={() => navigate("/persona")}
      >
        继续和 AI 聊聊
      </Button>

      <Card className="flex items-start gap-3 bg-[#f8fbf7] shadow-none">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
        <p className="text-xs leading-relaxed text-muted">
          平台不展示真实姓名、联系方式或真人照片，仅成人用户可用。
        </p>
      </Card>
    </div>
  );
}
