import { MoreHorizontal } from "lucide-react";
import { Card } from "../ui/card";
import { formatOnlineTime, cn } from "@/libs/utils";

const ChatCard = ({
  conversationId,
  name,
  timestamp,
  onSelect,
  unreadCount,
  leftSection,
  subtitle,
  setOpen
}) => {
  return (
    <Card
      key={conversationId}
      className={cn(
        "border-none p-3 cursor-pointer transition-all bg-sidebar hover:bg-muted"
      )}
      onClick={() => {
        onSelect(conversationId)
        setOpen(false)
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={cn(
                "font-semibold text-sm truncate",
                unreadCount && unreadCount > 0 && "text-foreground",
              )}
            >
              {name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {timestamp ? formatOnlineTime(timestamp) : ""}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {subtitle}
            </div>
            <MoreHorizontal className="size-4 text-muted-foreground opacity:0 group-hover:opacity-100 hover:size-5 transition-all" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChatCard;
