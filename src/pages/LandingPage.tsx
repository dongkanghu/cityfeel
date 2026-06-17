import {
  ArrowRight,
  BadgeCheck,
  Coffee,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { useToast } from "../components/common/Toast";
import { useDemoStore } from "../hooks/useDemoStore";

const featureCards = [
  {
    icon: ShieldCheck,
    title: "匿名开始",
    text: "不展示真实姓名和联系方式，首次见面默认选择公共场所。"
  },
  {
    icon: Sparkles,
    title: "少量推荐",
    text: "先理解你的见面节奏，再给出少量更适合的本周选择。"
  }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useDemoStore();
  const { showToast } = useToast();

  const jumpToDemo = () => {
    completeOnboarding();
    showToast("已载入示例画像，可快速预览本周计划");
    navigate("/home");
  };

  return (
    <div className="min-h-screen space-y-5 pb-8 pt-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-line bg-[#fffaf4] p-5 shadow-soft">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-latte/35" />
        <div className="absolute -bottom-16 left-6 h-28 w-28 rounded-full bg-sage/25" />
        <div className="relative space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-black text-coffee">
              <Coffee className="h-4 w-4" />
              CityFeel
            </div>
            <StatusBadge tone="success">匿名模式</StatusBadge>
          </div>
          <div className="space-y-3">
            <h1 className="text-[2.15rem] font-black leading-tight text-ink">
              先回答几个问题，再看看适合你的匹配
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              我们会根据你的见面节奏、聊天偏好和安全边界，推荐少量低压力线下匹配。
            </p>
          </div>
          <div className="grid gap-2">
            <Button
              className="w-full justify-between"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => navigate("/onboarding")}
            >
              开始看看适合我的见面方式
            </Button>
            <Button className="w-full" variant="ghost" onClick={jumpToDemo}>
              快速预览示例
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-3">
        {featureCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-oatmeal text-coffee">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-black text-ink">{item.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="flex items-start gap-3 bg-cream shadow-none">
        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
        <p className="text-xs leading-relaxed text-muted">
          当前为产品演示，匹配和聊天均为示例数据。仅面向成人用户，不展示真实姓名、联系方式或真人照片。
        </p>
      </Card>
    </div>
  );
}
