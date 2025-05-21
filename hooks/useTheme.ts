import { useThemeStore } from "@/store/themeStore";

export function useTheme() {
const theme = useThemeStore((s) => s.theme);
const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
const setTheme = useThemeStore((s) => s.setTheme);

  return { theme, resolvedTheme, setTheme };
}
