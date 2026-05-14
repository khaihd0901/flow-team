import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/libs/utils";

const ChatMessageSkeleton = ({ isOwn = false }) => {
  return (
    <div
      className={cn(
        "mt-2 flex gap-2 animate-pulse",
        isOwn ? "justify-end" : "justify-start",
      )}
    >
      {/* Avatar */}
      {!isOwn && (
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      )}

      {/* Bubble */}
      <div
        className={cn(
          "flex flex-col gap-2",
          isOwn ? "items-end" : "items-start",
        )}
      >
        <Card
          className={cn(
            "border-0 p-3",
            isOwn
              ? "bg-primary/10"
              : "bg-muted",
          )}
        >
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </Card>

        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
};

export default ChatMessageSkeleton;