import { Bell, BellRing } from "lucide-react";
import { useState } from "react";

export default function NotificationBell({
  count = 0,
  hasNew = false,
  onClick,
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label="Notifications"
      className="
        relative
        w-10
        h-10
        rounded-xl
        border
        border-border
        bg-card

        flex
        items-center
        justify-center

        overflow-visible

        transition-all
        duration-300
        ease-out

        hover:scale-105
        active:scale-95
      "
    >
      {/* Glow Effect */}
      <div
        className={`
          absolute
          inset-0
          rounded-xl
          transition-opacity
          duration-300

          ${hasNew ? "opacity-100" : "opacity-0"}

          bg-primary/10
        `}
      />

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

          ${
            hasNew
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }

          ${pressed ? "animate-bounce" : ""}
        `}
      >
        <BellRing className="w-5 h-5 text-primary" />
      </div>

      {/* Notification Badge */}
      {count > 0 && (
        <div
          className="
            absolute
            -top-1
            -right-1

            min-w-[18px]
            h-[18px]

            px-1

            rounded-full

            bg-red-500
            text-white

            text-[10px]
            font-semibold

            flex
            items-center
            justify-center

            border
            border-background

            animate-in
            zoom-in-50
            duration-300
          "
        >
          {count > 99 ? "99+" : count}
        </div>
      )}

      {/* Ping Animation */}
      {hasNew && (
       <span
  className="
    absolute
    w-6
    h-6
    rounded-lg
    border
    border-primary/40

    animate-ping

    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
  "
/>
      )}
    </button>
  );
}