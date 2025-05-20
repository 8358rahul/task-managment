import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { formatTimeForAPI } from "@/utils/formatTimeForAPI";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ms, ScaledSheet, vs } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";

export default function TaskCard({ task, onPress, onToggle }: any) {
  const {resolvedTheme: theme } = useTheme();

  const priorityColor =
    task.priority === 3
      ? "#ef4444"
      : task.priority === 2
      ? "#facc15"
      : "#10b981";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: Colors[theme].cart,
          borderColor: task.completed ? "#10b981" : Colors[theme].border,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText
          type="defaultSemiBold"
          style={[
            styles.title,
            {
              textTransform: "capitalize",
            },
          ]}
        >
          {task.title}
        </ThemedText>

        <TouchableOpacity onPress={() => onToggle(task.id)}>
          <Ionicons
            name={task.completed ? "checkmark-circle" : "ellipse-outline"}
            size={ms(22)}
            color={task.completed ? "#10b981" : Colors[theme].icon}
          />
        </TouchableOpacity>
      </View>

      <ThemedText type="default" style={[styles.description]} numberOfLines={2}>
        {task.description || "No description provided."}
      </ThemedText>

      <View style={styles.footer}>
        <ThemedText type="default" style={{ fontSize: ms(12),lineHeight:ms(18) }}>
          Due: {formatTimeForAPI(task.dueDate)}
        </ThemedText>

        <View
          style={{
            backgroundColor: priorityColor,
            borderRadius: ms(6),
            paddingHorizontal: ms(8),
            paddingVertical: vs(2),
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: ms(10),  
              textTransform: "capitalize",
              lineHeight: ms(18),
              color: "#fff",
            }}
          >
            {task.priority === 3
              ? "high"
              : task.priority === 2
              ? "medium"
              : "low"}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = ScaledSheet.create({
  card: {
    borderWidth: 0.5,
    borderRadius: 14,
    padding: "16@ms",
    marginBottom: "12@vs",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    flexShrink: 1,
  },
  description: {
    fontSize: "12@ms",
    marginBottom: "12@vs",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
