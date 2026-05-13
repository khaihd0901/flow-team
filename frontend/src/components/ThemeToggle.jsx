import { useThemeStore } from "@/stores/themeStore";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
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
        overflow-hidden
        shadow-sm

        transition-all
        duration-300
        ease-out

        hover:scale-105
        hover:shadow-md

        active:scale-95
      "
    >
      {/* Sun */}
      <div
        className={`
          absolute
          transition-all
          duration-500
          ease-[cubic-bezier(0.34,1.56,0.64,1)]

          ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-50 opacity-0"
          }
        `}
      >
        <Sun className="w-5 h-5 text-yellow-400" />
      </div>

      {/* Moon */}
      <div
        className={`
          absolute
          transition-all
          duration-500
          ease-[cubic-bezier(0.34,1.56,0.64,1)]

          ${
            isDark
              ? "rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }
        `}
      >
        <Moon className="w-5 h-5 text-primary" />
      </div>
    </button>
  );
}