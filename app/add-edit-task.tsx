import CustomButton from "@/components/CustomButton";
import CustomValidation from "@/components/CustomValidation";
import DateTimePickerModal from "@/components/DateTimePickerModal";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { formatTimeForAPI } from "@/utils/formatTimeForAPI";
import { getDateTimePickerProps } from "@/utils/getDateTimePickerProps";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";
import { useTaskStore } from "../store/taskStore";

const priorityData = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 2 },
  { label: "High", value: 3 },
];

export default function AddEditTaskScreen() {
  const navigation = useNavigation();
  const { control, handleSubmit, setValue, reset ,watch} = useForm();
  const route = useRoute();
  const { taskId } = (route.params as any) || {};
  const {tasks,addTask,updateTask} = useTaskStore();
  const existing = tasks?.find((t) => t.id === Number(taskId));
  const isEdit = Boolean(existing);
  const { resolvedTheme } = useTheme();

  const [dateTimePickerProps, setDateTimePickerProps] = useState<any>(
    getDateTimePickerProps(false)
  );

  useEffect(() => {
    if (isEdit) {
      let priority = priorityData?.find(
        (p: any) => p?.value === existing?.priority
      );  
      reset({
        id: existing?.id,
        completed: existing?.completed,
        title: existing?.title,
        description: existing?.description,
        priority: priority,
        dueDate: existing?.dueDate
      });
    }

    navigation.setOptions({
      title: isEdit ? "Edit Task" : "Add Task",
    });

    
  }, [isEdit]);

  const onSave = (data: any) => { 
    let params = {
      ...data, 
      id:  isEdit?existing?.id: Math.floor(Math.random() * 1000),
      priority: data?.priority?.value||2, 
    };   

    if (isEdit)updateTask(params);
    else addTask(params);
    navigation.goBack();  
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        padding: ms(12),
        paddingBottom: vs(100),
        backgroundColor: Colors[resolvedTheme]?.background,
      }}
    >
      <CustomValidation
        control={control}
        name="title"
        type="input"
        label="Title"
        placeholder="Enter title"
        rules={{ required: "Title is required" }}
      />
      <CustomValidation
        control={control}
        name="description"
        type="input"
        label="Description"
        placeholder="Enter description"
      />

      <CustomValidation
        type="picker"
        control={control}
        name={"priority"}
        label={"Priority"}
        data={priorityData}
        defaultValue={2}
      />
      <Text style={{fontSize:ms(10),color:Colors.primary,marginTop:vs(2)}}>Note: The priority will be set to medium if not selected</Text> 
      <CustomValidation
        type="input"
        control={control}
        placeholder="Select due date"
        name="dueDate"
        label="Due date"
        editable={false}
        value={formatTimeForAPI(watch('dueDate'))}
        rightIcon={
          <Fontisto name="date" size={ms(20)} color={Colors[resolvedTheme]?.text} />
        }
        onPress={() => {
          setDateTimePickerProps(getDateTimePickerProps(true));
        }}
        pointerEvents="none"
        rules={{ required: "Due date is required" }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: ms(20),
        }}
      >
        <CustomButton
          title="Clear"
          onPress={() => reset()}
          style={{ width: "45%"}}
          titleStyle={{ color: Colors.white }}
        />
        <CustomButton
          title="Save"
          onPress={handleSubmit(onSave)}
          style={{ width: "45%" }}
          titleStyle={{ color: Colors.white }}

        />
      </View>

      <DateTimePickerModal
        mode="date"
        dateTimePickerProps={dateTimePickerProps}
        setDateTimePickerProps={setDateTimePickerProps}
        minimumDate={new Date()}
        onDateTimeSelection={(event: any, selectedDate: any) => {
          if (event.type != "dismissed")
            setValue("dueDate", selectedDate.toISOString());
          setDateTimePickerProps(getDateTimePickerProps(false));
        }}
      />
    </ScrollView>
  );
}
