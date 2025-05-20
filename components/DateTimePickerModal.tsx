import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  TouchableOpacity
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";

const DateTimePickerModal = ({
  dateTimePickerProps,
  onDateTimeSelection,
  setDateTimePickerProps,
  mode,
  maximumDate,
  minimumDate,
}: {
  dateTimePickerProps: any;
  onDateTimeSelection: any;
  setDateTimePickerProps: any;
  maximumDate?: Date;
  minimumDate?: Date;
  mode: "date" | "time";
}) => {
  const { theme } = useTheme();

  if (!dateTimePickerProps?.visible) return null;

  const closeModal = () =>
    setDateTimePickerProps({
      ...dateTimePickerProps,
      visible: false,
    });

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={dateTimePickerProps?.value || new Date()}
        mode={mode}
        display={dateTimePickerProps?.display || "default"}
        is24Hour={dateTimePickerProps?.is24Hour ?? true}
        onChange={onDateTimeSelection}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    );
  }

  if (Platform.OS === "ios") {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
     
      >
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <Pressable
            style={[
              styles.modalContainer,
              { backgroundColor: Colors[theme].cart,
                

               },
            ]}
            onPress={() => {}}
          >
            <DateTimePicker
              value={dateTimePickerProps?.value || new Date()}
              mode={mode}
              display={dateTimePickerProps?.display || "spinner"}
              is24Hour={dateTimePickerProps?.is24Hour ?? true}
              onChange={onDateTimeSelection}
              style={{ width: "100%",  }}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              
            />

            <TouchableOpacity style={styles.doneButton} onPress={closeModal}>
              <ThemedText type="defaultSemiBold" style={{ color: Colors[theme].tint }}>
                Done
              </ThemedText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return null;
};

const styles = ScaledSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: "16@ms",
    borderTopRightRadius: "16@ms",
    padding: "16@ms",
  },
  doneButton: {
    alignItems: "center",
    paddingVertical: "12@vs",
  },
});

export default DateTimePickerModal;
