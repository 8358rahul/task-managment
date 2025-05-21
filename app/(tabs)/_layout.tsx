import { Tabs } from "expo-router";
import React from "react";
import { Platform, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ms, vs } from "react-native-size-matters";

export default function TabLayout() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[resolvedTheme].tint,
        headerTitleAlign: "center",
        tabBarButton: HapticTab,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              const nextTheme =
                theme === "light"
                  ? "dark"
                  : theme === "dark"
                  ? "system"
                  : "light";
              setTheme(nextTheme);
            }}
            style={{ right: ms(10) }}
          >
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={ms(24)}
              color={Colors[resolvedTheme].icon}
            />
          </TouchableOpacity>
        ),
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: Colors[resolvedTheme].cart,
            alignItems: "center",
            justifyContent: "center",
          },
          default: {
            backgroundColor: Colors[resolvedTheme].cart,
            alignItems: "center",
            justifyContent: "center",
            height: vs(45),
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "TaskBoard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="add-task"
              size={ms(24)}
              color={Colors.light.icon}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          title: "Video",
          tabBarIcon: ({ color }) => (
            <AntDesign
              name="videocamera"
              size={ms(24)}
              color={Colors.light.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}
