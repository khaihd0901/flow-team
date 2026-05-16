import { Dialog, DialogContent } from "@/components/ui/dialog";

import UserAvatar from "./chat/UserAvatar";
import { useFriendStore } from "@/stores/friendStore";
import { UserPlus, UserRoundX } from "lucide-react";

export default function UserProfileDialog({ open, onOpenChange, user }) {
  const {
    sendFriendRequest,
    loading: friendLoading,
    sentRequests,
  } = useFriendStore();
  if (!user) return null;
  const isRequested = sentRequests?.some(
    (request) => request.recipient === user._id,
  );
  const handleAddFriend = async (id) => {
    await sendFriendRequest({ recipientId: id });
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
            disabled={friendLoading}
            onClick={() => handleAddFriend(user._id)}
          >
            {isRequested ? (
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
