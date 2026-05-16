import { MessageCircle } from "lucide-react";

import DirectChatList from "./DirectChatList";

const conversations = [
  {
    id: 1,
    user: {
      fullName: "John Doe",
      username: "johndoe",
      avatarUrl: "",
      online: true,
    },
    lastMessage: "Hey, are you free tonight?",
    time: "2m ago",
    unread: 2,
    type: "message",
  },

  {
    id: 2,
    user: {
      fullName: "Emma Watson",
      username: "emma",
      avatarUrl: "",
      online: false,
    },
    lastMessage: "Sent a photo",
    time: "10m ago",
    unread: 0,
    type: "media",
  },
];

const ChatDropdown = ({ open,setOpen }) => {
  const hasConversations = conversations.length > 0;

  return (
    <div
      className={`
        absolute
        right-0
        top-full
        mt-3
        z-50
        w-[380px]

        origin-top-right

        transition-all
        duration-200

        ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }
      `}
    >
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-sidebar
          shadow-2xl
          backdrop-blur
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-4
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-primary/10
              "
            >
              <MessageCircle className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm font-semibold">Messages</p>

              <p className="text-xs text-muted-foreground">Recent chats</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {hasConversations && (
          <div className="max-h-[420px] overflow-y-auto py-2">
            <DirectChatList setOpen={setOpen} />
          </div>
        )}

        {/* EMPTY */}
        {!hasConversations && (
          <div className="py-14 text-center">
            <div
              className="
                mx-auto

                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-full
                bg-muted
              "
            >
              <MessageCircle className="size-6 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium">No messages yet</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your conversations will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDropdown;
