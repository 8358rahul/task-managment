import { type ViewProps } from 'react-native'

import { Colors } from '@/constants/Colors'
import { useTheme } from '@/hooks/useTheme'
import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import Animated from 'react-native-reanimated'

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  )
  const { resolvedTheme: theme } = useTheme()

  return (
    <Animated.View
      style={[{ backgroundColor: Colors[theme].background }, style]}
      {...otherProps}
    />
  )
}
