import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
} from "lucide-react";

import UserAvatar from "../chat/UserAvatar";

const notifications = [
  {
    id: 1,
    type: "friend",
    user: {
      fullName: "John Doe",
      username: "johndoe",
      avatarUrl: "",
    },
    content: "sent you a friend request",
    time: "2m ago",
    unread: true,
  },
];

const NotificationResult = ({ open }) => {
  const hasNotifications =
    notifications.length > 0;

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
          bg-background
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
              <Bell className="size-5 text-primary" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Notifications
              </p>

              <p className="text-xs text-muted-foreground">
                Recent activity
              </p>
            </div>
          </div>

          <button
            className="
              flex
              items-center
              gap-1
              rounded-lg
              px-2
              py-1

              text-xs
              font-medium
              text-primary

              transition-colors
              hover:bg-primary/10
            "
          >
            <CheckCheck className="size-4" />
            Mark all read
          </button>
        </div>

        {/* CONTENT */}
        {hasNotifications && (
          <div className="max-h-[420px] overflow-y-auto py-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                className="
                  group
                  relative

                  flex
                  w-full
                  items-start
                  gap-3

                  px-4
                  py-3

                  text-left

                  transition-all
                  duration-200

                  hover:bg-muted/50
                "
              >
                {/* UNREAD */}
                {notification.unread && (
                  <span
                    className="
                      absolute
                      right-4
                      top-4

                      h-2
                      w-2

                      rounded-full
                      bg-primary
                    "
                  />
                )}

                {/* AVATAR */}
                <div className="relative shrink-0">
                  <UserAvatar
                    avatarUrl={
                      notification.user.avatarUrl
                    }
                    alt={
                      notification.user.fullName
                    }
                    className="
                      h-11
                      w-11
                      rounded-full
                      border
                      object-cover
                    "
                  />

                  <div
                    className="
                      absolute
                      -bottom-1
                      -right-1

                      flex
                      h-5
                      w-5
                      items-center
                      justify-center

                      rounded-full
                      border
                      bg-background
                    "
                  >
                    {notification.type ===
                      "friend" && (
                      <UserPlus className="size-3 text-primary" />
                    )}

                    {notification.type ===
                      "message" && (
                      <MessageCircle className="size-3 text-primary" />
                    )}

                    {notification.type ===
                      "reaction" && (
                      <Heart className="size-3 text-primary" />
                    )}
                  </div>
                </div>

                {/* TEXT */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">
                      {
                        notification.user
                          .fullName
                      }
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {notification.content}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationResult;