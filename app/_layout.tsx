import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useThemeStore } from '@/store/themeStore';
import { Appearance } from 'react-native';

export default function RootLayout() {
  const { resolvedTheme, resolveTheme } = useThemeStore();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Watch system theme changes to keep Zustand in sync
  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      resolveTheme();
    });
    resolveTheme(); // initial resolve on app load
    return () => subscription.remove();
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" /> 
        
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
