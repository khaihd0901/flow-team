import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import IconButton from "./IconButton";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <IconButton
      onClick={toggleTheme}
      ariaLabel="Toggle Theme"
      className="hidden md:flex"
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
    </IconButton>
  );
}