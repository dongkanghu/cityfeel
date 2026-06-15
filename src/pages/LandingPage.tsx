import {
  ArrowRight,
  BadgeCheck,
  Coffee,
  MessageCircleHeart,
  Sparkles,
  UsersRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { StatusBadge } from "../components/common/StatusBadge";
import { useToast } from "../components/common/Toast";
import { useDemoStore } from "../hooks/useDemoStore";

const featureCards = [
  {
    icon: MessageCircleHeart,
    title: "1v1 咖啡匹配",
    text: "双方都同意后，自动成为好友，并进入集合地点确认。"
  },
  {
    icon: UsersRound,
    title: "多 v 多咖啡局",
    text: "每周一次 3v3 低压力社交局，AI 推荐地点与活动流程。"
  },
  {
    icon: Sparkles,
    title: "AI 卡片推荐",
    text: "根据画像推荐匿名用户卡片，也支持 DIY 自己的匿名卡片。"
  }
];

export function LandingPage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useDemoStore();
  const { showToast } = useToast();

  const jumpToDemo = () => {
    completeOnboarding();
    showToast("已载入 Demo 画像，可直接查看本周匹配");
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
              CityFeel Demo
            </div>
            <StatusBadge tone="success">匿名模式</StatusBadge>
          </div>
          <div className="space-y-3">
            <h1 className="text-[2.15rem] font-black leading-tight text-ink">
              让 AI 先理解你，再安排一杯刚刚好的咖啡
            </h1>
            <p className="text-sm leading-relaxed text-muted">
              匿名开始，通过几轮轻松对话生成你的社交画像。每周少量推荐适合你的咖啡活动、群组和潜在好友。
            </p>
          </div>
          <div className="grid gap-2">
            <Button
              className="w-full justify-between"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => navigate("/onboarding")}
            >
              开始 AI 建模
            </Button>
            <Button className="w-full" variant="secondary" onClick={jumpToDemo}>
              直接查看 Demo 匹配
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
          当前为产品 Demo，AI 对话和匹配均为模拟数据。仅面向成人用户，不展示真实姓名、联系方式或真人照片。
        </p>
      </Card>
    </div>
  );
}
