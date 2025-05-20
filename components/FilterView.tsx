import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import React, { memo } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { ms, ScaledSheet, vs } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";

const filters = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Incomplete", value: "incomplete" },
];

const sorts = [
  { label: "Due Date", value: "dueDate" },
  { label: "Priority", value: "priority" },
];

const FilterView = ({ setFilter, filter, sortBy, setSortBy }: any) => {
  const { resolvedTheme: theme } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: ms(12),
        gap: ms(10),
        height: vs(50),
        alignItems: "center",
        backgroundColor: Colors[theme].background,
      }}
    >
      {filters.map((filterItem: any) => (
        <TouchableOpacity
          key={filterItem.value}
          onPress={() => setFilter(filterItem.value)}
          style={[
            styles.btnStyle,
            {
              backgroundColor:
                filter === filterItem.value ? "#2563eb" : Colors[theme].cart,
            },
          ]}
        >
          <ThemedText
            type="default"
            style={{
              color:filter === filterItem.value ? Colors.white : Colors[theme].text,
            }}
          >
            {filterItem.label}
          </ThemedText>
        </TouchableOpacity>
      ))}

      {sorts.map((sortItem: any) => (
        <TouchableOpacity
          key={sortItem.value}
          onPress={() => setSortBy(sortItem.value)}
          style={[
            styles.btnStyle,
            {
              backgroundColor:
                sortBy === sortItem.value ? "#10b981" : Colors[theme].cart,
            },
          ]}
        >
          <ThemedText
            type="default"
            style={{
              color:sortBy === sortItem.value ? Colors.white : Colors[theme].text,
            }}
          >
            {`Sort: ${sortItem.label}`}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default memo(FilterView);

const styles = ScaledSheet.create({
  btnStyle: {
    paddingVertical: "6@vs",
    paddingHorizontal: "14@ms",
    borderRadius: "20@ms", 
    borderWidth:0.5
  },
});
