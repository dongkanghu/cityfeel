import { RotateCcw, Save, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AbstractAvatar } from "../components/common/AbstractAvatar";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import { TopBar } from "../components/layout/TopBar";
import { currentUser, profileSummary, type ProfileCard } from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

function parseList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function ProfilePage() {
  const { showToast } = useToast();
  const {
    diyProfileCard,
    selectedProfileTags,
    profileProgress,
    saveDiyProfileCard,
    restoreDefaultProfileCard
  } = useDemoStore();
  const [alias, setAlias] = useState(diyProfileCard.alias);
  const [bio, setBio] = useState(diyProfileCard.bio);
  const [tags, setTags] = useState(diyProfileCard.tags.join("、"));
  const [activityPreference, setActivityPreference] = useState(
    diyProfileCard.activityPreference.join("、")
  );
  const [avoidIntro, setAvoidIntro] = useState(diyProfileCard.avoidIntro);

  useEffect(() => {
    setAlias(diyProfileCard.alias);
    setBio(diyProfileCard.bio);
    setTags(diyProfileCard.tags.join("、"));
    setActivityPreference(diyProfileCard.activityPreference.join("、"));
    setAvoidIntro(diyProfileCard.avoidIntro);
  }, [diyProfileCard]);

  const preview: ProfileCard = {
    alias,
    bio,
    tags: parseList(tags),
    activityPreference: parseList(activityPreference),
    avoidIntro
  };

  const save = () => {
    saveDiyProfileCard(preview);
    showToast("匿名卡片已保存");
  };

  const restore = () => {
    restoreDefaultProfileCard();
    showToast("已恢复 AI 默认生成", "info");
  };

  return (
    <div className="space-y-4 pt-1">
      <TopBar title="我的匿名画像" subtitle="北京 · DIY 推荐卡片" />

      <Card className="space-y-4 bg-[#fffaf4]">
        <div className="flex items-start gap-3">
          <AbstractAvatar seed={currentUser.avatarSeed} label={preview.alias} size="xl" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-coffee">AI 生成画像</p>
            <h1 className="mt-1 text-2xl font-black text-ink">{currentUser.alias}</h1>
            <p className="mt-1 text-sm text-muted">城市：北京 · 用户均为成人</p>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted">
            <span>画像完成度</span>
            <span>{profileProgress || currentUser.profileCompleteness}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-oatmeal">
            <div
              className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage"
              style={{ width: `${profileProgress || currentUser.profileCompleteness}%` }}
            />
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">{profileSummary}</p>
        <div className="flex flex-wrap gap-2">
          {(selectedProfileTags.length ? selectedProfileTags : currentUser.tags).map((tag) => (
            <TagChip key={tag} tone="coffee">
              {tag}
            </TagChip>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted">我的匿名卡片预览</p>
            <h2 className="mt-1 text-xl font-black text-ink">{preview.alias || "未命名"}</h2>
          </div>
          <StatusBadge tone="success">匿名优先</StatusBadge>
        </div>
        <p className="text-sm leading-relaxed text-ink">{preview.bio}</p>
        <div className="flex flex-wrap gap-2">
          {preview.tags.map((tag, index) => (
            <TagChip key={tag} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))}
        </div>
        <div className="rounded-[1.2rem] bg-cream p-3">
          <p className="text-xs font-bold text-coffee">希望被推荐给</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {preview.activityPreference.join(" / ") || "低压力社交、稳定沟通、活动型见面"}
          </p>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-base font-black text-ink">DIY 编辑</h2>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-muted">匿名昵称</span>
          <input
            className="w-full rounded-2xl border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-coffee"
            value={alias}
            onChange={(event) => setAlias(event.target.value)}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-muted">一句话介绍</span>
          <textarea
            className="min-h-20 w-full resize-none rounded-2xl border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-coffee"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-muted">我的 3-5 个标签</span>
          <input
            className="w-full rounded-2xl border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-coffee"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="咖啡聊天、慢热、认真聊天"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-muted">偏好咖啡活动</span>
          <input
            className="w-full rounded-2xl border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-coffee"
            value={activityPreference}
            onChange={(event) => setActivityPreference(event.target.value)}
            placeholder="安静咖啡店、咖啡后轻散步"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-muted">不希望被如何介绍</span>
          <textarea
            className="min-h-20 w-full resize-none rounded-2xl border border-line bg-cream px-3 py-3 text-sm outline-none focus:border-coffee"
            value={avoidIntro}
            onChange={(event) => setAvoidIntro(event.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} onClick={restore}>
            恢复默认
          </Button>
          <Button icon={<Save className="h-4 w-4" />} onClick={save}>
            保存卡片
          </Button>
        </div>
      </Card>

      <Card className="flex items-start gap-3 bg-[#f8fbf7] shadow-none">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
        <p className="text-xs leading-relaxed text-muted">
          匿名卡片不会展示真实姓名、手机号、微信号、详细住址或真人照片。
        </p>
      </Card>
    </div>
  );
}
