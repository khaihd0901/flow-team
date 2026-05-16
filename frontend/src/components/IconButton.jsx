export default function IconButton({
  onClick,
  children,
  className = "",
  ariaLabel,
  glow = false,
  ping = false,
  badge,
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
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

        ${className}
      `}
    >
      {/* Glow */}
      {glow && (
        <div
          className="
            absolute
            inset-0
            rounded-xl
            bg-primary/10
            transition-opacity
            duration-300
          "
        />
      )}

      {children}

      {/* Badge */}
      {badge > 0 && (
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
          {badge > 99 ? "99+" : badge}
        </div>
      )}

      {/* Ping */}
      {ping && (
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