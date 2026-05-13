import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const newTheme = !get().isDark;

        set({ isDark: newTheme });

        document.documentElement.classList.toggle("dark", newTheme);
      },

      setTheme: (dark) => {
        set({ isDark: dark });

        document.documentElement.classList.toggle("dark", dark);
      },
    }),
    {
      name: "theme-storage",

      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
    }
  )
);