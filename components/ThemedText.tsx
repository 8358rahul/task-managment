import { type TextProps } from 'react-native'

import { Colors } from '@/constants/Colors'
import { useTheme } from '@/hooks/useTheme'
import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import Animated from 'react-native-reanimated'
import { ScaledSheet } from 'react-native-size-matters'

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link'
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const { resolvedTheme: theme } = useTheme()


  return (
    <Animated.Text
      style={[
        { color: Colors[theme].text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style
      ]}
      {...rest}
    />
  )
}

const styles = ScaledSheet.create({
  default: {
    fontSize: '16@ms',
    lineHeight: '24@vs',
    fontFamily: 'regular'
  },
  defaultSemiBold: {
    fontSize: '16@ms',
    lineHeight: '24@vs',
    fontWeight: '600',
    fontFamily: 'semiBold'
  },
  title: {
    fontSize: '32@ms',
    fontWeight: 'bold',
    lineHeight: '32@vs',
    fontFamily: 'bold'
  },
  subtitle: {
    fontSize: '20@ms',
    fontWeight: 'bold',
    fontFamily: 'medium'
  },
  link: {
    lineHeight: '30@vs',
    fontSize: '16@ms',
    color: '#0a7ea4',
    fontFamily: 'medium'
  }
})
