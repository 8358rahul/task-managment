import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { useTaskStore } from "@/store/taskStore";
import { formatTimeForAPI } from "@/utils/formatTimeForAPI";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import { ms, ScaledSheet, vs } from "react-native-size-matters";

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams<any>();
  const { tasks, deleteTask } = useTaskStore();
  const task: any = tasks?.find((t: any) => t?.id === Number(taskId));
  const { resolvedTheme } = useTheme(); 

  const navigation = useNavigation()
  useEffect(()=>{
        navigation.setOptions({
      title: "Task Details",
        headerBackTitleVisible: false, 
    });
  },[])

  const onDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTask(task?.id);
            router.back();
          },
        },
      ]
    );
  };

  const priorityColor =
    task?.priority === 3
      ? "#dc2626"
      : task?.priority === 2
      ? "#facc15"
      : "#10b981";

   if (!task) return <Text style={styles.errorText}>Task not found</Text>;


  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.card, { backgroundColor: Colors[resolvedTheme].cart }]}
      >
        <ThemedText type="subtitle" style={styles.title}>
          {task?.title}
        </ThemedText>

        <View style={{ height: vs(6) }} />
        <View style={styles.row}>
          <Ionicons name="calendar" size={18} color="#888" />
          <ThemedText type="default" style={styles.infoText}>
            Due: {formatTimeForAPI(task?.dueDate)}
          </ThemedText>
        </View>

        <View style={styles.row}>
          <Ionicons name="alert-circle" size={ms(18)} color={priorityColor} />
          <ThemedText
            type="default"
            style={[
              styles.infoText,
              { color: priorityColor, textTransform: "capitalize" },
            ]}
          >
            Priority:{" "}
            {task?.priority === 3
              ? "high"
              : task?.priority === 2
              ? "medium"
              : "low"}
          </ThemedText>
        </View>

        <View style={styles.row}>
          <Ionicons
            name={task?.completed ? "checkmark-done-circle" : "time"}
            size={ms(18)}
            color={task?.completed ? "#10b981" : "#f59e0b"}
          />
          <Text
            style={[
              styles.infoText,
              { color: task?.completed ? "#10b981" : "#f59e0b" },
            ]}
          >
            {task?.completed ? "Completed" : "Incomplete"}
          </Text>
        </View>

        <ThemedText
          type="defaultSemiBold"
          style={[styles.label, { marginTop: vs(12) }]}
        >
          Description
        </ThemedText>
        <ThemedText type="default" style={styles.description}>
          {task?.description?.trim()
            ? task?.description
            : "No description provided."}
        </ThemedText>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: ms(20),
        }}
      >
        <CustomButton
          title="Edit"
          isIcon={<Ionicons name="pencil" size={ms(18)} color={Colors.white} />}
          onPress={() => {
            router.push({
              pathname: "/add-edit-task",
              params: { taskId: task?.id },
            });
          }}
          style={{ width: "45%", backgroundColor: Colors.primary }}
          titleStyle={{ color: Colors.white }}
        />
        <CustomButton
          title="Delete"
          onPress={onDelete}
          isIcon={<Ionicons name="trash" size={ms(18)} color={Colors.white} />}
          style={{ width: "45%", backgroundColor: Colors.red }}
          titleStyle={{ color: Colors.white }}
        />
      </View>
    </ThemedView>
  );
}

const styles = ScaledSheet.create({
  container: { flex: 1, padding: "20@ms" },
  card: {
    padding: "20@ms",
    borderRadius: "16@ms",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  title: {
    textTransform: "capitalize",
    fontSize: "18@ms",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  infoText: {
    fontSize: "14@ms",
  },
  label: {
    fontSize: 14,
  },
  description: {
    fontSize: "12@ms",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "30@vs",
    gap: "12@ms",
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  errorText: {
    padding: 20,
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },
});
