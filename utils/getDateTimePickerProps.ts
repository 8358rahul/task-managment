import { Platform } from "react-native";

export const getDateTimePickerProps = (visible:boolean) => {
    return {
      visible: visible,
      mode: 'date',
      display: Platform.OS == 'ios' ? 'inline' : 'default',
      value: new Date(),
      uniqueKey: null,
      is24Hour: false,
      format: 'YYYY-MM-DD',
    };
  };