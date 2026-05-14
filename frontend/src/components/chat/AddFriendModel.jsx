import { useUserStore } from "@/stores/userStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useFriendStore } from "@/stores/friendStore";
import SearchFrom from "../AddFriendModal/SearchFrom";

const AddFriendModel = () => {
  const [isFound, setIsFound] = useState(null);
  const [searchUser, setSearchUser] = useState();
  const [searchedUserName, setSearchedUserName] = useState("");
  const{loading: userLoading,userSearchByName} = useUserStore();
  const{loading:friendLoading, sendFriendRequest} = useFriendStore();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center items-center size-5 rounded-xl hover:bg-sidebar-accent cursor-pointer z-10">
          <UserPlus className="size-4" />
          <span className="sr-only">Add Friend</span>
        </div>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[600px] border-none`}>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>
        {
          !isFound && <>
          <SearchFrom/>
          </>
        }
        {
          isFound && <>
          </>
        }
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendModel;
