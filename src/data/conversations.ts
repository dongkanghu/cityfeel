import {
  cardRecommendations,
  initialOneOnOneMessages,
  oneOnOneConversationId,
  oneOnOneUser,
  type ChatMessage
} from "./mock";

export type DemoConversationKind = "ai" | "user";
export type DemoConversationSource = "置顶" | "聚会" | "卡片推荐";

export type DemoConversation = {
  id: string;
  title: string;
  subtitle: string;
  profileLine: string;
  status: string;
  sourceLabel: DemoConversationSource;
  kind: DemoConversationKind;
  avatarSeed?: string;
  pinned?: boolean;
  tags: string[];
  quickReplies: string[];
  initialMessages: ChatMessage[];
  replySender: string;
  autoReply: string;
};

export const aiConversationId = "conv_ai_guide";
export const todayRecommendationUser = cardRecommendations[2];

export const demoConversations: DemoConversation[] = [
  {
    id: aiConversationId,
    title: "CityFeel AI",
    subtitle: "置顶 · 继续补充见面偏好",
    profileLine: "偏好推荐助手",
    status: "置顶",
    sourceLabel: "置顶",
    kind: "ai",
    avatarSeed: "cityfeel-ai",
    pinned: true,
    tags: ["AI 聊天", "推荐会变准", "偏好补充"],
    quickReplies: [
      "我想更新本周见面时间",
      "我更想先参加小组活动",
      "帮我解释一下为什么推荐这场"
    ],
    initialMessages: [
      {
        id: "ai_intro_1",
        conversationId: aiConversationId,
        sender: "ai",
        content:
          "我会持续帮你整理见面偏好。你可以告诉我本周时间、想要的氛围，或不想遇到的社交压力。",
        createdAt: "刚刚"
      },
      {
        id: "ai_intro_2",
        conversationId: aiConversationId,
        sender: "ai",
        content: "目前我判断你更适合低压力咖啡聊天，优先推荐 1v1 咖啡或 3v3 小组咖啡局。",
        createdAt: "刚刚"
      }
    ],
    replySender: "ai",
    autoReply:
      "收到。我会把这条偏好更新到本周推荐里，优先降低选择压力和见面压力。"
  },
  {
    id: oneOnOneConversationId,
    title: oneOnOneUser.alias,
    subtitle: "1v1 咖啡匹配 · 待确认地点",
    profileLine: "安静咖啡聊天",
    status: "确认地点",
    sourceLabel: "聚会",
    kind: "user",
    avatarSeed: oneOnOneUser.avatarSeed,
    tags: ["1v1", "咖啡聊天", "北京"],
    quickReplies: ["我们先定 15:00 吧", "我建议在地铁站出口集合", "可以先咖啡再轻散步"],
    initialMessages: initialOneOnOneMessages,
    replySender: oneOnOneUser.id,
    autoReply: "可以，这个安排比较轻松，我也能接受。"
  },
  {
    id: "conv_orange_demo",
    title: cardRecommendations[0].alias,
    subtitle: "匿名卡片 · 适合轻量聊天",
    profileLine: "下班轻松聊",
    status: "可以破冰",
    sourceLabel: "卡片推荐",
    kind: "user",
    avatarSeed: "orange-americano",
    tags: ["轻松幽默", "下班咖啡", "慢慢聊"],
    quickReplies: ["你平时喜欢哪类咖啡店？", "下班后咖啡可以", "我也不喜欢太用力聊天"],
    initialMessages: [
      {
        id: "orange_system",
        conversationId: "conv_orange_demo",
        sender: "system",
        content: "你们通过匿名卡片成为好友，可以先从轻量话题开始。",
        createdAt: "今天 13:12"
      },
      {
        id: "orange_1",
        conversationId: "conv_orange_demo",
        sender: "u_orange_americano",
        content: "我看到我们都适合下班后轻松聊聊，咖啡不用太正式。",
        createdAt: "今天 13:14"
      }
    ],
    replySender: "u_orange_americano",
    autoReply: "哈哈可以，我也喜欢自然一点的聊天节奏。"
  },
  {
    id: "conv_north_letter_demo",
    title: cardRecommendations[1].alias,
    subtitle: "匿名卡片 · 书店咖啡方向",
    profileLine: "书店咖啡慢聊",
    status: "慢慢聊",
    sourceLabel: "卡片推荐",
    kind: "user",
    avatarSeed: cardRecommendations[1].avatarSeed,
    tags: ["书店咖啡", "慢热", "认真倾听"],
    quickReplies: ["书店咖啡我也喜欢", "我们可以先聊聊最近看的书", "我更喜欢安静一点的地方"],
    initialMessages: [
      {
        id: "north_system",
        conversationId: "conv_north_letter_demo",
        sender: "system",
        content: "你们通过今日卡片推荐成为好友，可以先从书店、咖啡和城市角落聊起。",
        createdAt: "今天 10:26"
      },
      {
        id: "north_1",
        conversationId: "conv_north_letter_demo",
        sender: cardRecommendations[1].id,
        content: "我看到你也偏向安静咖啡店，感觉可以先轻松聊聊。",
        createdAt: "今天 10:28"
      }
    ],
    replySender: cardRecommendations[1].id,
    autoReply: "可以，我也更喜欢慢一点的聊天节奏。"
  }
];

export const todayRecommendationConversation: DemoConversation = {
  id: `conv_${todayRecommendationUser.id}`,
  title: todayRecommendationUser.alias,
  subtitle: "今日卡片 · 接受后进入聊天",
  profileLine: "周末咖啡探店",
  status: "新推荐",
  sourceLabel: "卡片推荐",
  kind: "user",
  avatarSeed: todayRecommendationUser.avatarSeed,
  tags: ["周末咖啡", "轻松聊天", "咖啡探店"],
  quickReplies: ["周末下午咖啡可以", "我也喜欢轻松一点的聊天", "可以先从咖啡店聊起"],
  initialMessages: [
    {
      id: "weekend_system",
      conversationId: `conv_${todayRecommendationUser.id}`,
      sender: "system",
      content: `你和「${todayRecommendationUser.alias}」已成为好友，可以先从周末咖啡话题开始。`,
      createdAt: "刚刚"
    },
    {
      id: "weekend_1",
      conversationId: `conv_${todayRecommendationUser.id}`,
      sender: todayRecommendationUser.id,
      content: "你好，我也更喜欢不太有压力的咖啡聊天。",
      createdAt: "刚刚"
    }
  ],
  replySender: todayRecommendationUser.id,
  autoReply: "可以，我周末下午通常比较方便，先轻松聊聊就好。"
};

export const chatPageConversationSeeds = [
  ...demoConversations,
  todayRecommendationConversation
];

export const chatSenderLabels: Record<string, string> = {
  ai: "CityFeel AI",
  [oneOnOneUser.id]: oneOnOneUser.alias,
  u_orange_americano: cardRecommendations[0].alias,
  u_north_letter: cardRecommendations[1].alias,
  u_weekend_cappu: cardRecommendations[2].alias,
  u_slow_star: "测试用户5"
};
