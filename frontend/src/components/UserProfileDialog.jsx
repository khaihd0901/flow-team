import { useEffect, useState } from "react";
import { Loader2, UserPlus, UserRoundX } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import UserAvatar from "./chat/UserAvatar";
import { useFriendStore } from "@/stores/friendStore";
import { useNotificationStore } from "@/stores/notificationStore";

export default function UserProfileDialog({ open, onOpenChange, user }) {
  const {
    sendFriendRequest,
    cancelFriendRequest,
    getSentFriendRequests,
    sentRequests,
  } = useFriendStore();
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        await getSentFriendRequests();
      } catch (err) {
        console.log(err);
      }
    };

    if (open) {
      loadRequests();
    }
  }, [open, getSentFriendRequests]);

  if (!user) return null;

  const request = sentRequests?.find(
    (request) => request.recipient === user._id,
  );

  const isRequested = !!request;

  const handleAddFriend = async () => {
    try {
      setLoadingAction(true);

      await sendFriendRequest({
        recipientId: user._id,
      });

      await getSentFriendRequests();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setLoadingAction(true);

      await cancelFriendRequest(request._id);

      await getSentFriendRequests();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            py-4
          "
        >
          <UserAvatar
            avatarUrl={user.avatarUrl}
            alt={user.fullName}
            className="
              h-24
              w-24
              rounded-full
              border
            "
          />

          <div className="text-center">
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              {user.fullName}
            </h2>

            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              @{user.username}
            </p>
          </div>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-primary
              px-4
              py-2
              text-sm
              font-medium
              text-primary-foreground
              transition-opacity
              hover:opacity-90
              disabled:opacity-50
            "
            disabled={loadingAction}
            onClick={isRequested ? handleCancelRequest : handleAddFriend}
          >
            {loadingAction ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : isRequested ? (
              <>
                <UserRoundX className="h-5 w-5" />
                <span>Cancel Friend Request</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Add Friend</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
