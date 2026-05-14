import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import UserAvatar from "./chat/UserAvatar";
import { useFriendStore } from "@/stores/friendStore";
import { UserPlus } from "lucide-react";

export default function UserProfileDialog({ open, onOpenChange, user }) {
  const {sendFriendRequest,loading:friendLoading} = useFriendStore();
  if (!user) return null;
const handleAddFriend = async (id)=>{
    await sendFriendRequest({recipientId: id})
}
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
              rounded-lg
              bg-primary
              px-4
              py-2
              text-sm
              font-medium
              text-primary-foreground

              transition-opacity
              hover:opacity-90
            "
            disabled={friendLoading}
            onClick={()=>handleAddFriend(user._id)}
          >
            <UserPlus/>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
