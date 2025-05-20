import { useThemeStore } from "@/store/themeStore";

export function useTheme() {
  const theme = useThemeStore((s) => s.theme); // <- this is the user's selected mode
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  return { theme, resolvedTheme, setTheme };
}
