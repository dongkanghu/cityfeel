export type UserSource = "one_on_one" | "group" | "card";

export type CardStatus = "default" | "request_sent" | "accepted" | "ignored";
export type OneOnOneStatus =
  | "recommended"
  | "waiting_other"
  | "activity_confirming"
  | "confirmed"
  | "skipped";
export type GroupStatus = "available" | "joined" | "planning" | "confirmed";

export type UserCard = {
  id: string;
  alias: string;
  ageRange: string;
  city: "北京";
  avatarSeed: string;
  matchScore: number;
  tags: string[];
  bio: string;
  aiReason: string;
  activityPreference: string[];
  source?: UserSource;
  status?: CardStatus;
};

export type ActivityLocation = {
  id: string;
  name: string;
  reason: string;
  votes: number;
};

export type Activity = {
  id: string;
  type: "one_on_one" | "group_3v3" | "group_6v6";
  title: string;
  matchScore: number;
  timeSuggestion: string;
  city: "北京";
  locationSuggestions: ActivityLocation[];
  aiReason: string;
  members: UserCard[];
  status: GroupStatus;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  sender: "system" | "me" | "ai" | string;
  content: string;
  createdAt: string;
};

export type OnboardingStep = {
  id: string;
  aiMessage: string;
  options: {
    label: string;
    tags: string[];
  }[];
};

export type AiChatPreset = {
  id: string;
  input: string;
  response: string;
  tags: string[];
};

export type ProfileReportSection = {
  title: string;
  content: string;
};

export type ProfileCard = {
  alias: string;
  bio: string;
  tags: string[];
  activityPreference: string[];
  avoidIntro: string;
};

export type Friend = {
  id: string;
  alias: string;
  avatarSeed: string;
  source: UserSource;
  status: string;
  tags: string[];
  conversationId: string;
};

export const currentUser = {
  id: "u_current",
  alias: "未命名的拿铁",
  ageRange: "25-29",
  city: "北京" as const,
  avatarSeed: "latte-current",
  tags: ["慢热", "咖啡聊天", "边界感", "低压力社交", "周末可约"],
  profileCompleteness: 82
};

export const defaultProfileTags = [
  "慢热",
  "咖啡聊天",
  "边界感",
  "低压力社交",
  "北京",
  "周末可约"
];

export const defaultProfileCard: ProfileCard = {
  alias: "未命名的拿铁",
  bio: "希望从一杯轻松的咖啡开始，慢慢认识一个真实的人。",
  tags: ["咖啡聊天", "慢热", "认真聊天", "北京周末", "边界感"],
  activityPreference: ["安静咖啡店", "咖啡后轻散步", "书店咖啡"],
  avoidIntro: "不希望被介绍成只想快速交换联系方式的人。"
};

export const profileSummary =
  "你偏向慢热但真诚的连接方式，更适合从低压力的咖啡聊天开始。相比快速破冰，你更重视对方是否尊重边界、是否守时，以及能否在安静环境中自然展开交流。";

export const onboardingScript: OnboardingStep[] = [
  {
    id: "first-impression",
    aiMessage:
      "你好，我会通过几个轻松的问题了解你的社交偏好。你希望别人第一次认识你时，先感受到你哪一面？",
    options: [
      { label: "温和可靠", tags: ["温和可靠"] },
      { label: "有趣松弛", tags: ["有趣松弛"] },
      { label: "独立清醒", tags: ["独立清醒"] },
      { label: "好奇心强", tags: ["好奇心强"] }
    ]
  },
  {
    id: "coffee-scene",
    aiMessage: "如果这周在北京安排一次见面，你更期待哪种咖啡场景？",
    options: [
      { label: "安静咖啡聊天", tags: ["咖啡聊天"] },
      { label: "咖啡 + 轻散步", tags: ["轻散步"] },
      { label: "精品咖啡探店", tags: ["探店"] },
      { label: "商圈咖啡快闪", tags: ["商圈见面"] },
      { label: "书店咖啡", tags: ["书店咖啡"] }
    ]
  },
  {
    id: "chat-pace",
    aiMessage: "你更喜欢怎样的聊天节奏？",
    options: [
      { label: "慢慢熟悉，不急着交换隐私", tags: ["慢热"] },
      { label: "可以轻松开玩笑", tags: ["幽默感"] },
      { label: "喜欢深入聊价值观", tags: ["深度聊天"] },
      { label: "希望对方主动一点", tags: ["偏好主动型搭子"] }
    ]
  },
  {
    id: "avoidance",
    aiMessage: "第一次咖啡见面时，你希望 AI 帮你避开什么样的匹配？",
    options: [
      { label: "目的性太强", tags: ["边界感"] },
      { label: "只看照片", tags: ["低压力社交"] },
      { label: "聊天压力太大", tags: ["低压力社交"] },
      { label: "临时爽约", tags: ["反爽约"] },
      { label: "过早索要联系方式", tags: ["隐私保护"] }
    ]
  }
];

export const aiChatPresets: AiChatPreset[] = [
  {
    id: "weekend-rhythm",
    input: "我周末更喜欢先找一家安静咖啡店，聊一会儿再决定要不要散步。",
    response:
      "我理解为：你需要一个可进可退的见面节奏。咖啡是低压力入口，轻散步适合作为聊得来之后的自然延伸，我会把“安静环境”和“节奏不赶”放进匹配条件。",
    tags: ["安静环境", "节奏不赶", "咖啡后散步"]
  },
  {
    id: "privacy-boundary",
    input: "第一次见面我不太想马上交换私人联系方式，希望先通过活动自然了解。",
    response:
      "这说明你很重视边界感和安全感。后续推荐会优先选择同样接受匿名沟通、愿意在公共场所见面、不会过早索要隐私信息的人。",
    tags: ["隐私保护", "匿名沟通", "公共场所"]
  },
  {
    id: "conversation-style",
    input: "我比较慢热，但如果对方愿意认真听，也可以聊一些真实的想法。",
    response:
      "你不是不想社交，而是更适合被稳定、真诚的对话打开。AI 会降低高压破冰和过度外向型推荐权重，增加“认真倾听”“深度聊天”的匹配权重。",
    tags: ["慢热", "认真倾听", "深度聊天"]
  },
  {
    id: "activity-preference",
    input: "比起很热闹的局，我更能接受三到六个人的小型咖啡活动。",
    response:
      "我会把你归入“小规模轻社交”偏好。适合你的活动不是大场派对，而是 3v3 咖啡局、书店咖啡或咖啡后短距离散步。",
    tags: ["小规模活动", "3v3 咖啡局", "书店咖啡"]
  }
];

export const profileReportSections: ProfileReportSection[] = [
  {
    title: "社交节奏",
    content:
      "你更适合从低压力、可停可进的互动开始。相比快速破冰，你更看重对方是否愿意稳定表达、认真倾听，并尊重慢慢熟悉的节奏。"
  },
  {
    title: "活动偏好",
    content:
      "北京的安静咖啡店、书店咖啡和咖啡后轻散步更适合你。首次见面建议控制在 60-90 分钟，避免过长或过于热闹的安排。"
  },
  {
    title: "匹配边界",
    content:
      "你对隐私保护、公共场所和不过早交换联系方式有明确偏好。后续推荐会优先筛选同样接受匿名沟通、边界感清晰的成人用户。"
  },
  {
    title: "推荐路径",
    content:
      "建议优先体验 1v1 咖啡聊天；如果想降低单独见面的压力，可以选择 3v3 北京咖啡轻社交局；卡片推荐保持少量但高匹配。"
  }
];

export const oneOnOneUser: UserCard = {
  id: "u_hutong_echo",
  alias: "胡同回声",
  ageRange: "25-29",
  city: "北京",
  avatarSeed: "hutong-echo",
  matchScore: 91,
  tags: ["安静幽默", "喜欢咖啡", "周末可约", "边界感强"],
  bio: "比起热闹局，更喜欢一杯咖啡里慢慢展开的话题。",
  aiReason:
    "你们都偏好低压力的咖啡见面，也都在对话中表达了对边界感和稳定节奏的重视。相比高强度社交，你们更可能在安静咖啡店中自然熟悉，并通过轻松话题逐步建立信任。",
  activityPreference: ["周六下午咖啡聊天", "咖啡后轻散步", "安静咖啡店"],
  source: "one_on_one"
};

export const cardRecommendations: UserCard[] = [
  {
    id: "u_orange_americano",
    alias: "橘子冰美式",
    ageRange: "25-29",
    city: "北京",
    avatarSeed: "orange-americano",
    matchScore: 89,
    tags: ["轻松幽默", "咖啡", "下班后可聊", "喜欢小动物"],
    bio: "想认识可以自然聊天、不需要每句话都很用力的人。",
    aiReason:
      "你们都偏好轻松但稳定的沟通方式，适合从一杯咖啡和日常话题开始。",
    activityPreference: ["下班咖啡", "周末咖啡店聊天"],
    source: "card"
  },
  {
    id: "u_north_letter",
    alias: "北岛来信",
    ageRange: "25-29",
    city: "北京",
    avatarSeed: "north-letter",
    matchScore: 86,
    tags: ["电影", "书店咖啡", "慢热", "表达真诚"],
    bio: "喜欢在城市里找安静角落，也喜欢认真听别人说话。",
    aiReason:
      "你们在“慢热”“深度聊天”“低压力活动”上的偏好高度接近。",
    activityPreference: ["书店咖啡", "安静咖啡店", "轻食"],
    source: "card"
  },
  {
    id: "u_weekend_cappu",
    alias: "周末卡布",
    ageRange: "25-29",
    city: "北京",
    avatarSeed: "weekend-cappu",
    matchScore: 83,
    tags: ["音乐", "周末活动", "外向但不压迫", "咖啡探店"],
    bio: "可以热闹，也可以安静，主要看和谁一起。",
    aiReason:
      "TA 的外向程度可以补充你的慢热特质，但活动节奏仍在你可接受范围内。",
    activityPreference: ["精品咖啡探店", "周末下午茶"],
    source: "card"
  }
];

export const groupMembers: UserCard[] = [
  {
    id: currentUser.id,
    alias: currentUser.alias,
    ageRange: currentUser.ageRange,
    city: "北京",
    avatarSeed: currentUser.avatarSeed,
    matchScore: 100,
    tags: ["慢热", "咖啡聊天", "边界感"],
    bio: "希望从一杯轻松的咖啡开始，慢慢认识一个真实的人。",
    aiReason: "当前用户",
    activityPreference: ["安静咖啡店"],
    source: "group"
  },
  {
    ...cardRecommendations[1],
    source: "group"
  },
  {
    ...cardRecommendations[2],
    source: "group"
  },
  {
    ...oneOnOneUser,
    source: "group"
  },
  {
    ...cardRecommendations[0],
    source: "group"
  },
  {
    id: "u_slow_star",
    alias: "慢半拍星人",
    ageRange: "25-29",
    city: "北京",
    avatarSeed: "slow-star",
    matchScore: 84,
    tags: ["慢节奏", "展览", "安静倾听"],
    bio: "比起抢话题，更喜欢把一句话讲完整。",
    aiReason: "TA 与本组成员在轻松社交和咖啡散步偏好上接近。",
    activityPreference: ["咖啡后看展", "胡同轻散步"],
    source: "group"
  }
];

export const groupLocations: ActivityLocation[] = [
  {
    id: "sanlitun",
    name: "三里屯 / 太古里周边",
    reason: "咖啡选择多，交通和后续活动选择更灵活。",
    votes: 2
  },
  {
    id: "liangma",
    name: "亮马河周边",
    reason: "适合咖啡后轻散步，氛围相对松弛。",
    votes: 3
  },
  {
    id: "wudaoying",
    name: "雍和宫 / 五道营周边",
    reason: "适合书店、咖啡、胡同轻散步组合。",
    votes: 1
  }
];

export const groupActivity: Activity = {
  id: "activity_group_3v3",
  type: "group_3v3",
  title: "3v3 北京咖啡轻社交局",
  matchScore: 88,
  timeSuggestion: "本周日 14:00 - 16:30",
  city: "北京",
  locationSuggestions: groupLocations,
  aiReason:
    "这组成员普遍偏好轻松、可进可退的社交场景。咖啡店能提供自然话题，也不会让首次见面产生过强压力。建议先进行 20 分钟低压力破冰，再自由分组聊天。",
  members: groupMembers,
  status: "available"
};

export const oneOnOneConversationId = "conv_one_on_one";
export const groupConversationId = "conv_group_activity";

export const initialOneOnOneMessages: ChatMessage[] = [
  {
    id: "m_1v1_system",
    conversationId: oneOnOneConversationId,
    sender: "system",
    content: "你们已互相同意，已自动添加为好友。请确认咖啡时间与集合地点。",
    createdAt: "今天 14:08"
  },
  {
    id: "m_1v1_hutong",
    conversationId: oneOnOneConversationId,
    sender: oneOnOneUser.id,
    content: "你好，我觉得三里屯附近可以，咖啡选择比较多。",
    createdAt: "今天 14:09"
  },
  {
    id: "m_1v1_me",
    conversationId: oneOnOneConversationId,
    sender: "me",
    content: "可以，我也更喜欢轻松一点的地方。",
    createdAt: "今天 14:10"
  }
];

export const initialGroupMessages: ChatMessage[] = [
  {
    id: "m_group_system",
    conversationId: groupConversationId,
    sender: "system",
    content: "你已加入「3v3 北京咖啡轻社交局」。AI 已推荐 3 个区域供大家选择。",
    createdAt: "今天 16:20"
  },
  {
    id: "m_group_north",
    conversationId: groupConversationId,
    sender: "u_north_letter",
    content: "我比较想选亮马河，咖啡后还可以走走。",
    createdAt: "今天 16:21"
  },
  {
    id: "m_group_orange",
    conversationId: groupConversationId,
    sender: "u_orange_americano",
    content: "可以，我也喜欢不要太赶的安排。",
    createdAt: "今天 16:22"
  },
  {
    id: "m_group_hutong",
    conversationId: groupConversationId,
    sender: "u_hutong_echo",
    content: "周日下午我可以。",
    createdAt: "今天 16:23"
  }
];

export const groupTopics = [
  "咖啡破冰 + 小组聊天",
  "精品咖啡探店 + 轻散步",
  "书店咖啡 + 话题卡破冰"
];

export const groupPlan = [
  "14:00 集合",
  "14:10 咖啡点单与轻破冰",
  "14:30 话题卡小组聊天",
  "15:20 自由换座交流",
  "16:00 咖啡后轻散步或自由解散"
];

export const safetyNotes = [
  "不展示真实姓名、手机号、微信号或详细住址。",
  "首次见面建议选择公共场所，并保留可自由离开的安排。",
  "举报、屏蔽和不感兴趣入口在 Demo 中会记录为本地反馈。"
];
