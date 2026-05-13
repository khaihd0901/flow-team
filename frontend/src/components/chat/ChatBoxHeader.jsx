
import { X } from "lucide-react";
import { useChatStore } from "@/stores/chatStore";
import { useAuthStore } from "@/stores/authStore";
import UserAvatar from "./UserAvatar";
import { useSocketStore } from "@/stores/socketStore";
import StatusBadge from "./StatusBadge";
import GroupChatAvatar from "./GroupChatAvatar";

const ChatBoxHeader = ({ onCloseChat, chat }) => {
  const { conversations, activeConversationId } = useChatStore();
  const { user } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  let otherUser;
  chat = chat ?? conversations.find((c) => c._id === activeConversationId);
  if (chat?.type === "direct") {
    const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
    otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

    if (!user || !otherUser) return;
  }
  console.log(chat)
  return (
    <div className="flex items-center justify-between border-b px-3 py-3">
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-3 relative">
          {chat.type === "direct" ? (
            <>
              <UserAvatar
                type={"chat"}
                name={otherUser?.fullName || "Team FLow"}
                avatarUrl={otherUser?.avatarUrl || undefined}
              />
              <StatusBadge
                status={
                  onlineUsers.includes(otherUser?._id || "")
                    ? "online"
                    : "offline"
                }
              />
            </>
          ) : (
            <GroupChatAvatar
              participants={chat.participants}
              type={`chat`}
            />
          )}
        </div>
        <p className="font-semibold">{otherUser?.fullName || chat.group.name}</p>
      </div>
      {/* Close button */}
      <button
        onClick={onCloseChat}
        className="rounded-full hover:bg-muted cursor-pointer"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatBoxHeader;
