import ChatCard from "./ChatCard";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/libs/utils";
import UserAvatar from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/socketStore";
import { useChatStore } from "@/stores/chatStore";
import { useChat } from "@/Contexts/chatContext";

const DirectChatCard = ({ conversation }) => {
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();

  const {
    activeConversationId,
    setActiveConversationId,
    messages,
    chatGetAllMessages,
  } = useChatStore();

  const { openChat } = useChat();

  if (!user) return null;

  const otherParticipant = conversation.participants.find(
    (p) => p._id !== user._id
  );

  if (!otherParticipant) return null;

  const unreadCount = conversation.unReadCounts[user._id] || 0;

  const lastMessage = conversation.lastMessage?.content ?? "";

  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);

    openChat(id);

    if (!messages[id]) {
      await chatGetAllMessages(id);
    }
  };

  return (
    <ChatCard
      conversationId={conversation._id}
      name={otherParticipant.fullName}
      timestamp={
        conversation.lastMessage?.createdAt
          ? new Date(conversation.lastMessage.createdAt)
          : undefined
      }
      isActive={activeConversationId === conversation._id}
      onSelect={handleSelectConversation}
      unreadCount={unreadCount}
      leftSection={
        <>
          <UserAvatar
            type="sidebar"
            name={otherParticipant.fullName ?? ""}
            avatarUrl={otherParticipant?.avatarUrl ?? undefined}
          />

                    <StatusBadge
            status={
              onlineUsers.includes(otherParticipant?._id || "") ? "online" : "offline"
            }
          />

          {unreadCount > 0 && (
            <UnreadCountBadge unreadCount={unreadCount} />
          )}
        </>
      }
      subtitle={
        <p
          className={cn(
            "text-sm truncate",
            unreadCount > 0
              ? "font-medium text-foreground"
              : "text-muted-foreground"
          )}
        >
          {lastMessage}
        </p>
      }
    />
  );
};

export default DirectChatCard;