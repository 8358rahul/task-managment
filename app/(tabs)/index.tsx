import FilterView from "@/components/FilterView";
import FloatingAddButton from "@/components/FloatingAddButton";
import NoDataFound from "@/components/NoDataFound";
import TaskCard from "@/components/TaskItem";
import { ThemedView } from "@/components/ThemedView";
import AndPoints from "@/constants/AndPoints";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { useTaskStore } from "@/store/taskStore";
import { fetcher } from "@/utils/fetcher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { ms, vs } from "react-native-size-matters";

export default function TaskScreen() {
  const { theme, setTheme,resolvedTheme } = useTheme();
  const { tasks, addTask, toggleTask } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");

  const navigation = useNavigation();

  useEffect(() => {
    if (tasks.length === 0) {
      fetchTasks();
    } else {
      setLoading(false);
    }
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const nextTheme =
    theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
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
    });
  }, []);

  async function fetchTasks() {
    try {
      const data = await fetcher(AndPoints.TASKURL);
      const initialTasks = data?.map((t: any) => ({
        id: t?.id,
        title: t?.title,
        description: "",
        dueDate: new Date().toISOString(),
        priority: 2,
        completed: t?.completed,
      }));
      initialTasks.forEach((task: any) => addTask(task));
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  }

  // Filtering
  const filtered = tasks?.filter((task: any) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? task.completed
      : !task.completed
  );

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return a.priority - b.priority;
    }
  });

  if (loading)
    return (
      <ActivityIndicator
        size={"large"}
        color={Colors.primary}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      />
    );

  return (
    <ThemedView style={{ flex: 1, padding: ms(12) }}>
      {/* Filter Buttons */}

      <FilterView
        setFilter={setFilter}
        setSortBy={setSortBy}
        filter={filter}
        sortBy={sortBy}
      />

      <View style={{ height: vs(18) }} />

      <FlatList
        data={sorted}
        keyExtractor={(item, index) => index?.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoDataFound onPress={() => fetchTasks()} />}
        contentContainerStyle={{ paddingBottom: vs(80) }}
        renderItem={({ item }) => {
          return (
            <TaskCard
              task={item}
              onToggle={() => toggleTask(item.id)}
              onPress={() =>
                router.push({
                  pathname: "/task-details",
                  params: { taskId: item.id },
                })
              }
            />
          );
        }}
      />
      <FloatingAddButton onPress={() => router.push("/add-edit-task")} />
    </ThemedView>
  );
}
