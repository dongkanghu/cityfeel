import { RefreshCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatBubble } from "../components/chat/ChatBubble";
import { Card } from "../components/common/Card";
import { TopBar } from "../components/layout/TopBar";
import { useDemoStore } from "../hooks/useDemoStore";

export function PersonaPage() {
  const navigate = useNavigate();
  const {
    personaMessages,
    profileProgress,
    onboardingCompleted,
    sendPersonaMessage,
    refreshPersonaTopics,
    getPersonaTopics
  } = useDemoStore();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [personaMessages.length]);

  const topics = getPersonaTopics();
  const hasUserMessage = personaMessages.some((m) => m.sender === "me");
  const progress = onboardingCompleted ? Math.max(profileProgress, 40) : profileProgress;

  const submit = (text: string) => {
    if (!text.trim()) return;
    sendPersonaMessage(text);
    setDraft("");
  };

  return (
    <div className="flex h-[calc(100vh-88px)] flex-col pt-1">
      <TopBar
        title="AI 搭子"
        subtitle="聊得越深，匹配越准"
        right={
          <button
            type="button"
            onClick={() => navigate("/onboarding")}
            className="rounded-full bg-oatmeal px-3 py-1 text-[11px] font-bold text-coffee"
          >
            重新问卷
          </button>
        }
      />

      <Card className="mb-3 bg-[#fffaf4]">
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-muted">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-coffee" />
            AI 已了解
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-oatmeal">
          <div
            className="h-full rounded-full bg-gradient-to-r from-coffee via-latte to-sage transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto pb-3"
      >
        {personaMessages.map((message) => (
          <ChatBubble key={message.id} message={message} senderName="AI 搭子" />
        ))}

        {!hasUserMessage ? (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-muted">
              <span>不知道聊什么？试试</span>
              <button
                type="button"
                onClick={refreshPersonaTopics}
                className="flex items-center gap-1 text-coffee"
              >
                <RefreshCcw className="h-3 w-3" />
                换一换
              </button>
            </div>
            <div className="space-y-1.5">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => submit(topic)}
                  className="w-full rounded-2xl border border-line bg-white/90 px-3 py-2 text-left text-sm text-ink shadow-soft active:translate-y-[1px]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <form
        className="sticky bottom-0 -mx-4 flex items-center gap-2 border-t border-line/70 bg-cream/92 px-4 py-3 backdrop-blur-xl"
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="和 AI 说点什么…"
          className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-coffee"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-white disabled:bg-muted/60"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
