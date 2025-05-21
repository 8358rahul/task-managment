import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import React, { JSX } from "react";
import {
  ActivityIndicator,
  Pressable,
  View
} from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";

interface CustomButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  isIcon?: JSX.Element;
  iconStyle?: any;
  style?: any;
  disabled?: boolean;
  numberOfLines?: number;
  title: string;
  titleStyle?: any;
  isGradient?: boolean;
  textType?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
}

const CustomButton = (props: CustomButtonProps) => {
  const { resolvedTheme:theme } = useTheme();

  return (
    <Pressable
      disabled={props.disabled}
      onPress={props.onPress}
      style={[
        styles.gradient,
        {
          backgroundColor: props.disabled ? Colors.gray : Colors.primary,
          borderColor: Colors[theme].border,
        },
        props.style,
      ]}
    >
      {props.isLoading ? (
        <ActivityIndicator size={"small"} color={Colors.white} />
      ) : (
        <View style={styles.iconContainer}>
          <View style={[styles.iconStyle, props.iconStyle]}>
            {props.isIcon}
          </View>

          <ThemedText
            numberOfLines={props.numberOfLines}
            type={props.textType ?? "defaultSemiBold"}
            style={props.titleStyle}
          >
            {props.title}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = ScaledSheet.create({
  button: {
    borderRadius: "25@ms",
    overflow: "hidden",
    width: "100%",
  },
  gradient: {
    paddingVertical: "7@vs",
    paddingHorizontal: "30@s",
    borderRadius: "16@ms",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
  },
  loaderStyle: {
    position: "relative",
    width: "80%",
    backgroundColor: "transparent",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    marginRight: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
