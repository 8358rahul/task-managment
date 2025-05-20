// src/store/themeStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  resolveTheme: () => void; // Updates resolvedTheme from system
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: Appearance.getColorScheme() || 'light',

      setTheme: (theme) => {
        set({ theme });
        get().resolveTheme();
        // update resolvedTheme as well
        if (theme === 'system') {
          const system = Appearance.getColorScheme() || 'light';
          set({ resolvedTheme: system });
        } else {
          set({ resolvedTheme: theme });
        }
      },

      resolveTheme: () => {
        const current = get().theme;
        const system = Appearance.getColorScheme() || 'light';
        set({
          resolvedTheme: current === 'system' ? system : (current as 'light' | 'dark'),
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ theme: state.theme }), // Persist only theme, not resolvedTheme
    }
  )
);
