import { MessageCircle, MessageCircleMore } from "lucide-react";
import IconButton from "../IconButton";

export default function ChatIconButton({
  count = 0,
  hasNew = false,
  onClick,
}) {
  return (
    <IconButton
      onClick={onClick}
      ariaLabel="Messages"
      glow={hasNew}
      ping={hasNew}
      badge={count}
    >
      {/* Idle */}
      <div
        className={`
          absolute
          transition-all
          duration-500
          ease-[cubic-bezier(0.34,1.56,0.64,1)]

          ${
            hasNew
              ? "scale-0 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }
        `}
      >
        <MessageCircle className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Active */}
      <div
        className={`
          absolute
          transition-all
          duration-500
          ease-[cubic-bezier(0.34,1.56,0.64,1)]

          ${
            hasNew
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }
        `}
      >
        <MessageCircleMore className="w-5 h-5 text-primary" />
      </div>
    </IconButton>
  );
}