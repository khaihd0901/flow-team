import { Bell, BellRing } from "lucide-react";
import IconButton from "../IconButton";

export default function NotificationBell({
  count = 0,
  hasNew = false,
  onClick,
}) {

  return (
    <IconButton
      onClick={onClick}
      ariaLabel="Notifications"
      glow={hasNew}
      ping={hasNew}
      badge={count}
      className=""
    >
      {/* Idle Bell */}
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
        <Bell className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Active Bell */}
      <div
        className={`
          absolute
          transition-all
          duration-500
          ease-[cubic-bezier(0.34,1.56,0.64,1)]
        `}
      >
        <BellRing className="w-5 h-5 text-primary" />
      </div>
    </IconButton>
  );
}