// src/store/themeStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  resolveTheme: () => void; // Updates resolvedTheme from system
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: Appearance.getColorScheme() || "light",

      setTheme: (theme) => {
        set({ theme });
        const system = Appearance.getColorScheme() || "light";
        const resolved = theme === "system" ? system : theme;
        set({ resolvedTheme: resolved });
      },
      resolveTheme: () => {
        const { theme } = get();
        const system = Appearance.getColorScheme() || "light";
        const resolved = theme === "system" ? system : theme;
        set({ resolvedTheme: resolved });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }), // Persist only theme, not resolvedTheme
    }
  )
);
