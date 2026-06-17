import {
  ArrowLeft,
  ArrowRight,
  Bot,
  FileText,
  MessageCircle,
  SendHorizonal,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { TagChip } from "../components/common/TagChip";
import { useToast } from "../components/common/Toast";
import {
  aiChatPresets,
  currentUser,
  defaultProfileTags,
  onboardingScript,
  profileSummary,
  type ChatMessage
} from "../data/mock";
import { useDemoStore } from "../hooks/useDemoStore";

const choiceSteps = onboardingScript.slice(0, 2);

type OnboardingPhase = "choices" | "chat" | "report";

function pickAiReply(input: string) {
  const exactMatch = aiChatPresets.find((preset) => preset.input === input);
  if (exactMatch) return exactMatch;

  const keywordMatch = aiChatPresets.find((preset) =>
    preset.tags.some((tag) => input.includes(tag.replace("咖啡后", "")))
  );
  if (keywordMatch) return keywordMatch;

  return {
    id: "fallback",
    input,
    response:
      "我会把这条回答记录为你的个性化线索，并用来判断更适合你的聊天节奏、活动方式和安全边界。",
    tags: ["个性化线索", "画像补充"]
  };
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    profileProgress,
    selectedProfileTags,
    setOnboardingProgress,
    completeOnboarding
  } = useDemoStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<OnboardingPhase>("choices");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "onboarding_ai_0",
      conversationId: "onboarding",
      sender: "ai",
      content: choiceSteps[0].aiMessage,
      createdAt: "刚刚"
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [draft, setDraft] = useState("");
  const [presetIndex, setPresetIndex] = useState(0);

  const currentStep = choiceSteps[stepIndex];
  const chatTurnCount = messages.filter((message) =>
    message.id.startsWith("onboarding_chat_me")
  ).length;
  const visibleTags = useMemo(
    () =>
      selectedProfileTags.length > 0
        ? selectedProfileTags
        : profileProgress > 0
          ? defaultProfileTags.slice(0, 2)
          : [],
    [profileProgress, selectedProfileTags]
  );

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages.length, phase]);

  const pickOption = (label: string, tags: string[]) => {
    if (isThinking || phase !== "choices") return;

    const nextProgress = stepIndex === choiceSteps.length - 1 ? 42 : 22;
    setOnboardingProgress(nextProgress, tags);
    setMessages((current) => [
      ...current,
      {
        id: `onboarding_me_${Date.now()}`,
        conversationId: "onboarding",
        sender: "me",
        content: label,
        createdAt: "刚刚"
      }
    ]);

    setIsThinking(true);
    window.setTimeout(() => {
      if (stepIndex < choiceSteps.length - 1) {
        const nextStep = choiceSteps[stepIndex + 1];
        setStepIndex((current) => current + 1);
        setMessages((current) => [
          ...current,
          {
            id: `onboarding_ai_${Date.now()}`,
            conversationId: "onboarding",
            sender: "ai",
            content: nextStep.aiMessage,
            createdAt: "刚刚"
          }
        ]);
      } else {
        setPhase("chat");
        setMessages((current) => [
          ...current,
          {
            id: `onboarding_ai_chat_start_${Date.now()}`,
            conversationId: "onboarding",
            sender: "ai",
            content:
              "我已经有了初步判断。接下来你可以再补充一点见面偏好：不知道怎么写也没关系，点一个下方示例即可。",
            createdAt: "刚刚"
          }
        ]);
        showToast("可以继续补充见面偏好", "info");
      }
      setIsThinking(false);
    }, 650);
  };

  const fillNextPreset = () => {
    const preset = aiChatPresets[presetIndex];
    setDraft(preset.input);
    setPresetIndex((current) => (current + 1) % aiChatPresets.length);
  };

  const sendChat = () => {
    const input = draft.trim();
    if (!input || isThinking || phase !== "chat") return;

    const aiReply = pickAiReply(input);
    const nextTurnCount = chatTurnCount + 1;
    setDraft("");
    setMessages((current) => [
      ...current,
      {
        id: `onboarding_chat_me_${Date.now()}`,
        conversationId: "onboarding",
        sender: "me",
        content: input,
        createdAt: "刚刚"
      }
    ]);

    setIsThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `onboarding_chat_ai_${Date.now()}`,
          conversationId: "onboarding",
          sender: "ai",
          content: aiReply.response,
          createdAt: "刚刚"
        }
      ]);
      setOnboardingProgress(Math.min(74, 42 + nextTurnCount * 11), aiReply.tags);
      setIsThinking(false);
      showToast("AI 已更新画像线索");
    }, 680);
  };

  const generateReport = () => {
    const tags = visibleTags.length > 0 ? visibleTags : defaultProfileTags;
    completeOnboarding(tags);
    setPhase("report");
    setMessages((current) => [
      ...current,
      {
        id: `onboarding_report_${Date.now()}`,
        conversationId: "onboarding",
        sender: "ai",
        content: "我已经形成了初步理解。你可以确认摘要，也可以去看本周计划。",
        createdAt: "刚刚"
      }
    ]);
    showToast("AI 对你的理解已更新");
  };

  const enterHome = () => {
    completeOnboarding(visibleTags.length > 0 ? visibleTags : defaultProfileTags);
    navigate("/home");
  };

  return (
    <div className="min-h-screen space-y-4 pb-8 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-muted shadow-sm"
          onClick={() => navigate("/")}
          aria-label="返回入口页"
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs font-bold text-coffee">北京 · 低压力见面</p>
          <h1 className="truncate text-lg font-black text-ink">先了解你的见面偏好</h1>
        </div>
        <div className="h-10 w-10" />
      </div>

      <PreferenceProgress
        phase={phase}
        stepIndex={stepIndex}
        chatTurnCount={chatTurnCount}
        tags={visibleTags}
      />

      <Card className="space-y-3 bg-[#fffaf4]">
        <div className="flex items-center gap-2 text-sm font-black text-coffee">
          <Bot className="h-4 w-4" />
          AI 了解中
        </div>
        <div className="space-y-3">
          {messages.map((message) => {
            const isMe = message.sender === "me";
            return (
              <div key={message.id} className={isMe ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    isMe
                      ? "max-w-[84%] rounded-3xl rounded-br-lg bg-ink px-4 py-3 text-sm leading-relaxed text-white"
                      : "max-w-[88%] rounded-3xl rounded-bl-lg border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink"
                  }
                >
                  {message.content}
                </div>
              </div>
            );
          })}
          {isThinking ? (
            <div className="inline-flex rounded-full bg-white px-3 py-2 text-xs text-muted">
              AI 正在整理偏好...
            </div>
          ) : null}
        </div>
      </Card>

      {phase === "choices" ? (
        <div className="grid gap-2">
          {currentStep.options.map((option) => (
            <Button
              key={option.label}
              className="w-full justify-start text-left"
              variant="secondary"
              disabled={isThinking}
              onClick={() => pickOption(option.label, option.tags)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      ) : null}

      {phase === "chat" ? (
        <Card className="space-y-4 border-coffee/20 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-coffee">
                <MessageCircle className="h-4 w-4" />
                <h2 className="text-base font-black">补充一点见面偏好</h2>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                可以选一个话题，也可以自己写一句。聊得越多，推荐越准。
              </p>
            </div>
            <StatusPill count={chatTurnCount} />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {aiChatPresets.map((preset) => (
              <Button
                key={preset.id}
                className="min-h-9 shrink-0 rounded-full px-3 py-1.5 text-xs"
                variant="secondary"
                onClick={() => setDraft(preset.input)}
              >
                {preset.tags[0].replace("咖啡后散步", "咖啡后走走")}
              </Button>
            ))}
          </div>

          <div className="rounded-[1.25rem] border border-line bg-cream p-2">
            <textarea
              className="min-h-24 w-full resize-none bg-transparent px-2 py-2 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Tab") {
                  event.preventDefault();
                  fillNextPreset();
                }
                if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                  sendChat();
                }
              }}
              placeholder="写一句你的见面偏好，或点下方示例"
            />
            <div className="flex items-center justify-between gap-2 px-1 pb-1">
              <Button variant="ghost" className="min-h-9 px-3 text-xs" onClick={fillNextPreset}>
                换个示例
              </Button>
              <Button
                className="min-h-9 px-3 text-xs"
                icon={<SendHorizonal className="h-4 w-4" />}
                onClick={sendChat}
                disabled={!draft.trim()}
                loading={isThinking}
              >
                发送
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            icon={<FileText className="h-4 w-4" />}
            disabled={chatTurnCount < 2 || isThinking}
            onClick={generateReport}
          >
            {chatTurnCount < 2 ? "再补充一点后查看理解" : "查看 AI 对我的理解"}
          </Button>
        </Card>
      ) : null}

      {phase === "report" ? (
        <Card className="space-y-4 border-coffee/20 bg-white">
          <div className="flex items-center gap-2 text-coffee">
            <Sparkles className="h-4 w-4" />
            <h2 className="text-base font-black">AI 对你的理解</h2>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted">匿名昵称</p>
            <p className="mt-1 text-xl font-black text-ink">{currentUser.alias}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted">{profileSummary}</p>
          <div className="grid gap-2">
            {[
              ["见面方式", "低压力、60-90 分钟，从安静咖啡聊天开始。"],
              ["推荐场景", "安静空间 / 咖啡后轻散步 / 小范围活动。"],
              ["安全偏好", "公共场所，先不交换私人联系方式。"]
            ].map(([title, content]) => (
              <div key={title} className="rounded-[1.2rem] bg-cream p-3">
                <p className="text-sm font-black text-ink">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{content}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(visibleTags.length > 0 ? visibleTags : defaultProfileTags).slice(0, 5).map((tag) => (
              <TagChip key={tag} tone="coffee">
                {tag}
              </TagChip>
            ))}
          </div>
          <Button
            className="w-full justify-between"
            icon={<ArrowRight className="h-4 w-4" />}
            onClick={enterHome}
          >
            去看本周计划
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

function PreferenceProgress({
  phase,
  stepIndex,
  chatTurnCount,
  tags
}: {
  phase: OnboardingPhase;
  stepIndex: number;
  chatTurnCount: number;
  tags: string[];
}) {
  const copy =
    phase === "choices"
      ? {
          title: `还差 ${Math.max(0, choiceSteps.length - stepIndex)} 个问题`,
          progress: stepIndex === 0 ? 18 : 42,
          note: "这个问题会帮助我们判断适合你的见面节奏。"
        }
      : phase === "chat"
        ? {
            title: `已补充 ${chatTurnCount}/2 条偏好`,
            progress: Math.min(74, 42 + chatTurnCount * 16),
            note: "可以继续聊天，也可以在两轮后查看 AI 对你的理解。"
          }
        : {
            title: "已形成初步理解",
            progress: 82,
            note: "你可以随时回来补充，推荐会继续变准。"
          };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-coffee">偏好进度</p>
          <h2 className="truncate text-lg font-black text-ink">{copy.title}</h2>
        </div>
        <span className="shrink-0 text-2xl font-black text-ink">{copy.progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-oatmeal">
        <div
          className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage transition-all duration-500"
          style={{ width: `${copy.progress}%` }}
        />
      </div>
      <p className="text-xs leading-relaxed text-muted">{copy.note}</p>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <TagChip key={`${tag}-${index}`} tone={index % 2 ? "sage" : "coffee"}>
              {tag}
            </TagChip>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function StatusPill({ count }: { count: number }) {
  return (
    <div className="shrink-0 rounded-full bg-oatmeal px-3 py-1 text-xs font-black text-coffee">
      {count}/2
    </div>
  );
}
