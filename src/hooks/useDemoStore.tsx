import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  cardRecommendations,
  currentUser,
  defaultProfileCard,
  defaultProfileTags,
  groupConversationId,
  groupLocations,
  initialGroupMessages,
  initialOneOnOneMessages,
  oneOnOneConversationId,
  oneOnOneUser,
  type CardStatus,
  type ChatMessage,
  type Friend,
  type GroupStatus,
  type OneOnOneStatus,
  type ProfileCard,
  type UserCard
} from "../data/mock";

const STORAGE_KEY = "cityfeel-demo-state-v1";

type DemoState = {
  onboardingCompleted: boolean;
  profileProgress: number;
  selectedProfileTags: string[];
  oneOnOneStatus: OneOnOneStatus;
  groupStatus: GroupStatus;
  cardRequestStatusMap: Record<string, CardStatus>;
  friends: Friend[];
  chats: Record<string, ChatMessage[]>;
  diyProfileCard: ProfileCard;
  locationVotes: Record<string, number>;
  selectedLocationId: string | null;
  groupTopicIndex: number;
};

type DemoStore = DemoState & {
  setOnboardingProgress: (progress: number, tags: string[]) => void;
  completeOnboarding: (tags?: string[]) => void;
  startOneOnOneWaiting: () => void;
  resolveOneOnOneAccepted: () => void;
  confirmOneOnOneActivity: () => void;
  skipOneOnOne: () => void;
  joinGroupActivity: () => void;
  cycleGroupTopic: () => void;
  voteLocation: (locationId: string) => void;
  confirmGroupActivity: () => void;
  sendFriendRequest: (userId: string) => void;
  acceptCardFriend: (userId: string) => void;
  ignoreCard: (userId: string) => void;
  saveDiyProfileCard: (profileCard: ProfileCard) => void;
  restoreDefaultProfileCard: () => void;
  sendMessage: (conversationId: string, content: string, sender?: string) => void;
  addSystemMessage: (conversationId: string, content: string) => void;
};

const initialState: DemoState = {
  onboardingCompleted: false,
  profileProgress: 0,
  selectedProfileTags: [],
  oneOnOneStatus: "recommended",
  groupStatus: "available",
  cardRequestStatusMap: Object.fromEntries(
    cardRecommendations.map((user) => [user.id, "default"])
  ),
  friends: [],
  chats: {},
  diyProfileCard: defaultProfileCard,
  locationVotes: Object.fromEntries(
    groupLocations.map((location) => [location.id, location.votes])
  ),
  selectedLocationId: null,
  groupTopicIndex: 0
};

const DemoStoreContext = createContext<DemoStore | null>(null);

function readStoredState(): DemoState {
  if (typeof window === "undefined") {
    return initialState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    return {
      ...initialState,
      ...parsed,
      cardRequestStatusMap: {
        ...initialState.cardRequestStatusMap,
        ...parsed.cardRequestStatusMap
      },
      chats: {
        ...initialState.chats,
        ...parsed.chats
      },
      locationVotes: {
        ...initialState.locationVotes,
        ...parsed.locationVotes
      },
      diyProfileCard: {
        ...initialState.diyProfileCard,
        ...parsed.diyProfileCard
      }
    };
  } catch {
    return initialState;
  }
}

function messageId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function nowLabel() {
  return "刚刚";
}

function conversationIdForUser(userId: string) {
  return `conv_${userId}`;
}

function toFriend(user: UserCard, source: Friend["source"], status: string): Friend {
  return {
    id: user.id,
    alias: user.alias,
    avatarSeed: user.avatarSeed,
    source,
    status,
    tags: user.tags.slice(0, 3),
    conversationId:
      user.id === oneOnOneUser.id ? oneOnOneConversationId : conversationIdForUser(user.id)
  };
}

function addFriendIfMissing(friends: Friend[], friend: Friend) {
  const existing = friends.find((item) => item.id === friend.id);
  if (!existing) {
    return [...friends, friend];
  }
  return friends.map((item) =>
    item.id === friend.id ? { ...item, status: friend.status } : item
  );
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => readStoredState());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setOnboardingProgress = useCallback((progress: number, tags: string[]) => {
    setState((current) => ({
      ...current,
      profileProgress: progress,
      selectedProfileTags: Array.from(new Set([...current.selectedProfileTags, ...tags]))
    }));
  }, []);

  const completeOnboarding = useCallback((tags?: string[]) => {
    setState((current) => ({
      ...current,
      onboardingCompleted: true,
      profileProgress: currentUser.profileCompleteness,
      selectedProfileTags:
        tags && tags.length > 0
          ? Array.from(new Set([...tags, "北京", "周末可约"]))
          : defaultProfileTags
    }));
  }, []);

  const startOneOnOneWaiting = useCallback(() => {
    setState((current) => ({
      ...current,
      oneOnOneStatus: "waiting_other"
    }));
  }, []);

  const resolveOneOnOneAccepted = useCallback(() => {
    setState((current) => {
      const friend = toFriend(oneOnOneUser, "one_on_one", "活动确认中");
      return {
        ...current,
        oneOnOneStatus: "activity_confirming",
        friends: addFriendIfMissing(current.friends, friend),
        chats: {
          ...current.chats,
          [oneOnOneConversationId]:
            current.chats[oneOnOneConversationId] ?? initialOneOnOneMessages
        }
      };
    });
  }, []);

  const confirmOneOnOneActivity = useCallback(() => {
    setState((current) => ({
      ...current,
      oneOnOneStatus: "confirmed",
      friends: current.friends.map((friend) =>
        friend.id === oneOnOneUser.id ? { ...friend, status: "活动已确认" } : friend
      ),
      chats: {
        ...current.chats,
        [oneOnOneConversationId]: [
          ...(current.chats[oneOnOneConversationId] ?? initialOneOnOneMessages),
          {
            id: messageId("m_1v1_confirm"),
            conversationId: oneOnOneConversationId,
            sender: "system",
            content: "活动已确认：本周六 15:00，三里屯附近地铁站出口集合。",
            createdAt: nowLabel()
          }
        ]
      }
    }));
  }, []);

  const skipOneOnOne = useCallback(() => {
    setState((current) => ({
      ...current,
      oneOnOneStatus: "skipped"
    }));
  }, []);

  const joinGroupActivity = useCallback(() => {
    setState((current) => {
      const groupFriend = toFriend(cardRecommendations[1], "group", "同组成员");
      return {
        ...current,
        groupStatus: "joined",
        friends: addFriendIfMissing(current.friends, groupFriend),
        chats: {
          ...current.chats,
          [groupConversationId]: current.chats[groupConversationId] ?? initialGroupMessages
        }
      };
    });
  }, []);

  const cycleGroupTopic = useCallback(() => {
    setState((current) => ({
      ...current,
      groupTopicIndex: (current.groupTopicIndex + 1) % 3
    }));
  }, []);

  const voteLocation = useCallback((locationId: string) => {
    setState((current) => {
      const nextVotes = { ...current.locationVotes };
      if (current.selectedLocationId && current.selectedLocationId !== locationId) {
        nextVotes[current.selectedLocationId] = Math.max(
          0,
          (nextVotes[current.selectedLocationId] ?? 0) - 1
        );
      }
      if (current.selectedLocationId !== locationId) {
        nextVotes[locationId] = (nextVotes[locationId] ?? 0) + 1;
      }
      return {
        ...current,
        groupStatus: current.groupStatus === "available" ? "available" : "planning",
        selectedLocationId: locationId,
        locationVotes: nextVotes
      };
    });
  }, []);

  const confirmGroupActivity = useCallback(() => {
    setState((current) => ({
      ...current,
      groupStatus: "confirmed",
      chats: {
        ...current.chats,
        [groupConversationId]: [
          ...(current.chats[groupConversationId] ?? initialGroupMessages),
          {
            id: messageId("m_group_confirm"),
            conversationId: groupConversationId,
            sender: "system",
            content: "多人咖啡局已确认：本周日 14:00 按当前投票地点集合。",
            createdAt: nowLabel()
          }
        ]
      }
    }));
  }, []);

  const sendFriendRequest = useCallback((userId: string) => {
    setState((current) => ({
      ...current,
      cardRequestStatusMap: {
        ...current.cardRequestStatusMap,
        [userId]: "request_sent"
      }
    }));
  }, []);

  const acceptCardFriend = useCallback((userId: string) => {
    const user = cardRecommendations.find((item) => item.id === userId);
    if (!user) return;

    setState((current) => {
      const friend = toFriend(user, "card", "新好友");
      const conversationId = conversationIdForUser(user.id);
      return {
        ...current,
        cardRequestStatusMap: {
          ...current.cardRequestStatusMap,
          [userId]: "accepted"
        },
        friends: addFriendIfMissing(current.friends, friend),
        chats: {
          ...current.chats,
          [conversationId]:
            current.chats[conversationId] ?? [
              {
                id: messageId("m_card_system"),
                conversationId,
                sender: "system",
                content: `你和「${user.alias}」已成为好友，可以从咖啡话题开始聊天。`,
                createdAt: nowLabel()
              },
              {
                id: messageId("m_card_friend"),
                conversationId,
                sender: user.id,
                content: "你好，我看到我们都适合从轻松咖啡聊天开始。",
                createdAt: nowLabel()
              }
            ]
        }
      };
    });
  }, []);

  const ignoreCard = useCallback((userId: string) => {
    setState((current) => ({
      ...current,
      cardRequestStatusMap: {
        ...current.cardRequestStatusMap,
        [userId]: "ignored"
      }
    }));
  }, []);

  const saveDiyProfileCard = useCallback((profileCard: ProfileCard) => {
    setState((current) => ({
      ...current,
      diyProfileCard: profileCard
    }));
  }, []);

  const restoreDefaultProfileCard = useCallback(() => {
    setState((current) => ({
      ...current,
      diyProfileCard: defaultProfileCard
    }));
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, content: string, sender = "me") => {
      const trimmed = content.trim();
      if (!trimmed) return;

      setState((current) => ({
        ...current,
        chats: {
          ...current.chats,
          [conversationId]: [
            ...(current.chats[conversationId] ?? []),
            {
              id: messageId("m_chat"),
              conversationId,
              sender,
              content: trimmed,
              createdAt: nowLabel()
            }
          ]
        }
      }));
    },
    []
  );

  const addSystemMessage = useCallback((conversationId: string, content: string) => {
    sendMessage(conversationId, content, "system");
  }, [sendMessage]);

  const value = useMemo<DemoStore>(
    () => ({
      ...state,
      setOnboardingProgress,
      completeOnboarding,
      startOneOnOneWaiting,
      resolveOneOnOneAccepted,
      confirmOneOnOneActivity,
      skipOneOnOne,
      joinGroupActivity,
      cycleGroupTopic,
      voteLocation,
      confirmGroupActivity,
      sendFriendRequest,
      acceptCardFriend,
      ignoreCard,
      saveDiyProfileCard,
      restoreDefaultProfileCard,
      sendMessage,
      addSystemMessage
    }),
    [
      state,
      setOnboardingProgress,
      completeOnboarding,
      startOneOnOneWaiting,
      resolveOneOnOneAccepted,
      confirmOneOnOneActivity,
      skipOneOnOne,
      joinGroupActivity,
      cycleGroupTopic,
      voteLocation,
      confirmGroupActivity,
      sendFriendRequest,
      acceptCardFriend,
      ignoreCard,
      saveDiyProfileCard,
      restoreDefaultProfileCard,
      sendMessage,
      addSystemMessage
    ]
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error("useDemoStore must be used inside DemoStoreProvider");
  }
  return context;
}
