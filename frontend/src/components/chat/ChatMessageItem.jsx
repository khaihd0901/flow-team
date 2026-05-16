import { cn, formatMessageTime } from "@/libs/utils";

import UserAvatar from "./UserAvatar";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const ChatMessageItem = ({
  message,
  index,
  messages,
  selectedConver,
  lastMessageStatus,
}) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isGroupBreak =
    index === 0 ||
    message.senderId._id !== prev?.senderId._id ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const senderId =
  message?.senderId?._id || message?.senderId;

const participant =
  selectedConver?.participants?.find(
    (p) =>
      p?._id?.toString() === senderId?.toString(),
  );

  const handleReact = (emoji) => {
    if (message.isOwn) return;

    console.log("React:", emoji, message._id);
  };
  console.log(participant)
  return (
    <div
      className={cn(
        "group flex gap-2 message-bounce mt-1",
        message.isOwn ? "justify-end" : "justify-start",
      )}
    >
      {/* LEFT AVATAR */}
      {!message.isOwn && (
        <div className="w-8">
          {isGroupBreak && (
            <UserAvatar
              type="chat"
              name={participant.fullName || "User"}
              avatarUrl={participant.avatarUrl || undefined}
            />
          )}
        </div>
      )}

      {/* MESSAGE AREA */}
      <div
        className={cn(
          "relative flex flex-col space-y-1 max-w-xs lg:max-w-md",
          message.isOwn ? "items-end" : "items-start",
        )}
      >
        {/* REACTION BAR */}
        {!message.isOwn && (
          <div
            className={cn(
              "absolute -top-9 z-20 flex items-center gap-1 rounded-full border bg-background px-2 py-1 shadow-md transition-all duration-200",
              "opacity-0 translate-y-2 pointer-events-none",
              "group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
              "left-0",
            )}
          >
            {reactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="text-lg transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* MESSAGE */}
        <Card
          className={cn(
            "relative p-3 transition-all duration-200 ring-1",
            message.isOwn
              ? "chat-bubble-sent border-0"
              : "bg-chat-bubble-received",
          )}
        >
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
        </Card>

        {/* TIME */}
        {isGroupBreak && (
          <span className="px-1 text-xs text-muted-foreground">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
        )}

        {/* STATUS */}
        {message.isOwn && message._id === selectedConver.lastMessage?._id && (
          <Badge
            variant="outline"
            className={cn(
              "border-0 px-1.5 py-0.5 text-xs",
              lastMessageStatus === "seen"
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {lastMessageStatus}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
