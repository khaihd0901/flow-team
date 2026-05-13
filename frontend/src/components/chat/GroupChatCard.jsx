import { useAuthStore } from "@/stores/authStore";
import ChatCard from "./ChatCard";
import UnreadCountBadge from "./UnreadCountBadge";
import GroupChatAvatar from "./GroupChatAvatar";
import { useChatStore } from "@/stores/chatStore";
import { useChat } from "@/Contexts/chatContext";

const GroupChatCard = ({ conversation }) => {
    const { openChat } = useChat();
  
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversationId, messages,chatGetAllMessages } =
    useChatStore();

  if (!user) return;

  const unreadCount =  0;
  const name = conversation.group?.name ?? "";
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
      name={name}
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
          {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          <GroupChatAvatar
          name={conversation.group.name}
            participants={conversation.participants}
            type="chat"
          />
        </>
      }
      subtitle={
        <p className={`text-sm text-muted-foreground truncate`}>
          {conversation.participants.length} members
        </p>
      }
    />
  );
};

export default GroupChatCard;
