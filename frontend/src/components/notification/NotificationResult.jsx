import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from "lucide-react";

import UserAvatar from "../chat/UserAvatar";
import { useNotificationStore } from "@/stores/notificationStore";
import { useFriendStore } from "@/stores/friendStore";
const NotificationResult = ({ open }) => {
  const notifications = useNotificationStore((state) => state.notifications);

  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );

  const { acceptFriendRequest, rejectFriendRequest } = useFriendStore();

  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id);

      removeNotification(id);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id);

      removeNotification(id);
    } catch (err) {
      console.log(err);
    }
  };
  const hasNotifications = notifications?.length > 0;

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
              <p className="text-sm font-semibold">Notifications</p>

              <p className="text-xs text-muted-foreground">Recent activity</p>
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
        {hasNotifications ? (
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
                    avatarUrl={notification.user.avatarUrl}
                    alt={notification.user.fullName}
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
                    {notification.type === "friend" && (
                      <UserPlus className="size-3 text-primary" />
                    )}

                    {notification.type === "message" && (
                      <MessageCircle className="size-3 text-primary" />
                    )}

                    {notification.type === "reaction" && (
                      <Heart className="size-3 text-primary" />
                    )}
                  </div>
                </div>

                {/* TEXT */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">
                      {notification.user.fullName}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {notification.content}
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {notification.time}
                  </p>
                  {/* FRIEND REQUEST ACTIONS */}
                  {notification.type === "friend" && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(notification._id);
                        }}
                        className="
          rounded-md
          bg-primary
          px-3
          py-1.5
          text-xs
          rounded-xl
          font-medium
          text-primary-foreground
          transition-opacity
          hover:opacity-90
        "
                      >
                        Accept
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(notification._id);
                        }}
                        className="
          rounded-xl
          border
          px-3
          py-1.5
          text-xs
          font-medium
          transition-colors
          hover:bg-muted
        "
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div
            className="
      flex
      flex-col
      items-center
      justify-center
      gap-3
      px-6
      py-14
      text-center
    "
          >
            <div
              className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-primary/10
      "
            >
              <Bell className="size-7 text-primary" />
            </div>

            <div>
              <h3 className="text-sm font-semibold">No notifications yet</h3>

              <p
                className="
          mt-1
          text-xs
          text-muted-foreground
        "
              >
                When someone sends you a message or friend request, it will
                appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationResult;
