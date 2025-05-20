import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller, FieldError } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { ms, mvs, ScaledSheet, vs } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";

type RequiredProps = {
  name: string;
  type: "input" | "picker" | "checkbox" | "radio" | "image" | "datetime";
  control: any;
};

interface TextInputProps extends RequiredProps {
  label?: string;
  leftIcon?: any;
  rightIcon?: any;
  placeholder?: string | undefined;
  disabled?: boolean;
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
  maxLength?: number;
  multiline?: boolean;
  onFocus?: () => void;
  defaultValue?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  readOnly?: boolean;
  onPressIcon?: () => void;
  rules?: any;
  searchPlaceholder?: string;
  isSearch?: boolean;
  keyToShowData?: string;
  keyToCompareData?: string;
  searchField?: string;
  data?: any;
  multiSelect?: boolean;
  labelStyle?: any;
  maxSelect?: number;
  editable?: boolean;
  secureTextEntry?: boolean;
  numberOfChecked?: number;
  onPress?: () => void;
  keyboardType?:
    | "default"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "email-address"
    | "url"
    | "phone-pad";
  mode?: "dialog" | "dropdown";
  inputMode?: "outlined" | "flat";
  position?: "auto" | "top" | "bottom";
  size?: number;
  inputContainerStyle?: any;
  inputStyle?: any;
  containerStyle?: any;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
  value?: any;
  isLoading?: boolean;
  hideStar?: boolean;
  itemContainerStyle?: any;
  wrapperStyle?: any;
  autoFocus?: boolean;
  onChangeText?: any;
}

const CustomValidation = (props: TextInputProps) => {
  const { numberOfChecked = 1, inputMode = "outlined" } = props;
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const dropIcon = (
    value: any,
    error: FieldError | undefined,
    onChange: { (...event: any[]): void; (arg0: null): void }
  ) => {
    if (props.isLoading) {
      return <ActivityIndicator size="small" color={Colors.primary} />;
    }

    if (
      value &&
      !props.disabled &&
      !error &&
      !props.multiSelect &&
      props.rightIcon
    ) {
      return (
        <AntDesign
          name="close"
          color={Colors.gray}
          size={ms(24)}
          onPress={() => {
            if (props.disabled) {
              return;
            } else {
              onChange(null);
            }
          }}
        />
      );
    } else {
      return (
        <Feather
          name="chevron-down"
          size={ms(24)}
          color={error ? Colors.red : Colors.gray}
        />
      );
    }
  };

  const renderSelectedItem = (item: any, removeItem: any) => {
    return (
      <TouchableOpacity
        key={item[props?.keyToCompareData ?? "value"]}
        style={[
          styles.selectedItem,
          { backgroundColor: Colors[theme].background },
        ]}
        onPress={() => removeItem?.(item)}
      >
        <ThemedText
          style={[styles.selectedItemText, { color: Colors[theme].text }]}
        >
          {item[props.keyToShowData ?? "label"]}
        </ThemedText>
        <AntDesign
          name="closecircle"
          color={Colors.gray}
          size={ms(16)}
          onPress={() => {
            removeItem?.(item);
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Controller
      control={props?.control}
      name={props?.name ? props?.name : ""}
      rules={props?.rules}
      defaultValue={props?.defaultValue}
      disabled={props?.disabled}
      key={props?.name ? props?.name : ""}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }: any) => {
        const errStyle = {
          backgroundColor: props.disabled ? Colors.gray : Colors[theme].input,
          borderColor: error
            ? Colors.red
            : isFocused
            ? Colors[theme].border
            : Colors[theme].border,
        };
        return (
          <View style={[styles.container, props.wrapperStyle]}>
            {/* input validation  */}
            {props?.type === "input" && (
              <Pressable
                style={{
                  width: "100%",
                  marginTop: error ? 0 : mvs(10),

                  ...props.inputContainerStyle,
                }}
                disabled={props.disabled ? true : false}
                onPress={
                  props.onPress
                    ? props.onPress
                    : props.onPressIcon
                    ? props.onPressIcon
                    : () => {
                        console.log("onPress");
                      }
                }
              >
                {inputMode !== "flat" && (
                  <View style={{ flexDirection: "row" }}>
                    <ThemedText
                      type="default"
                      style={{ color: Colors[theme].lightText }}
                    >
                      {props.label}
                    </ThemedText>
                    {props.rules?.required &&
                      !props.hideStar &&
                      props.label && (
                        <ThemedText style={styles.star}>*</ThemedText>
                      )}
                  </View>
                )}

                <View style={[styles.inputContainer, errStyle]}>
                  {props.leftIcon && (
                    <View style={styles.icon}>{props.leftIcon}</View>
                  )}
                  <TextInput
                    placeholderTextColor={Colors[theme].lightText}
                    secureTextEntry={props?.secureTextEntry}
                    value={props?.value ?? value}
                    placeholder={props.placeholder ?? "Enter " + props.label}
                    onChangeText={onChange}
                    numberOfLines={props.multiline ? 5 : 1}
                    keyboardType={props.keyboardType}
                    returnKeyType={props.returnKeyType}
                    editable={props.editable}
                    pointerEvents={props?.pointerEvents}
                    maxLength={props.maxLength}
                    multiline={props.multiline}
                    autoFocus={props.autoFocus}
                    onFocus={() => {
                      props.onFocus?.();
                      setIsFocused(true);
                    }}
                    autoCapitalize={props.autoCapitalize || "none"}
                    autoCorrect={props.autoCorrect}
                    readOnly={props.readOnly}
                    onBlur={() => {
                      onBlur?.();
                      setIsFocused(false);
                    }}
                    style={[
                      styles.input,
                      {
                        color: Colors[theme].text,
                      },
                      props.inputStyle,
                    ]}
                  />
                  {/* Right icon or clear */}
                  {props.rightIcon ? (
                    <View style={styles.icon}>{props.rightIcon}</View>
                  ) : (
                    props.value &&
                    !props.editable && (
                      <TouchableOpacity
                        style={styles.icon}
                        onPress={() => {
                          props.disabled ? null : onChange(null);
                        }}
                      >
                        <Ionicons
                          name="close"
                          size={ms(20)}
                          // color={Colors[theme].icon}
                          color={"red"}
                        />
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </Pressable>
            )}

            {/* dropdown validation  */}
            {props?.type === "picker" && (
              <View
                style={{
                  marginTop: error ? 0 : mvs(10),
                  width: "100%",
                  ...props.inputContainerStyle,
                }}
              >
                <View style={{ flexDirection: "row", marginTop: vs(5) }}>
                  <ThemedText
                    type="default"
                    style={{ color: Colors[theme].lightText }}
                  >
                    {props.label}
                  </ThemedText>
                  {props.rules?.required && !props.hideStar && (
                    <ThemedText style={styles.star}>*</ThemedText>
                  )}
                </View>
                {!props.multiSelect ? (
                  <Dropdown
                    style={[
                      styles.dropDownInput,
                      errStyle,
                      props.inputStyle,
                      {
                        backgroundColor: Colors[theme].input,
                        shadowColor: Colors[theme].input,
                      },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    containerStyle={{
                      backgroundColor: Colors[theme].cart,  
                      marginTop: vs(3),
                      borderRadius: ms(5),
                      

                    }
                    }
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      { color: Colors[theme].text },
                    ]}
                    inputSearchStyle={[
                      styles.inputSearchStyle,
                      {
                        color: Colors[theme].text,
                        backgroundColor: Colors[theme].input,
                      },
                    ]}
                    itemTextStyle={[
                      styles.showText,
                      {
                        color: Colors[theme].text,
                      },
                    ]}
                    iconColor={
                      error
                        ? Colors.red
                        : props.disabled
                        ? Colors.gray
                        : Colors.primary
                    }
                    mode="default" //default,modal
                    dropdownPosition={props.position ?? "auto"}
                    onFocus={() => {
                      props.onFocus?.();
                      setIsFocused(true);
                    }}
                    renderRightIcon={() => dropIcon(value, error, onChange)}
                    search={props.isSearch ?? false}
                    searchField={
                      props.searchField ?? props.keyToShowData ?? "label"
                    }
                    data={props.data}
                    maxHeight={vs(300)}
                    labelField={
                      props.keyToShowData ? props.keyToShowData : "label"
                    }
                    valueField={
                      props.keyToCompareData ? props.keyToCompareData : "value"
                    }
                    placeholder={props.placeholder}
                    searchPlaceholder={props.searchPlaceholder ?? "Search"}
                    disable={props.disabled}
                    activeColor={Colors.gray}
                    iconStyle={styles.iconStyle}
                    showsVerticalScrollIndicator={false}
                    value={value}
                    onChange={onChange}
                    onChangeText={props.onChangeText}
                    onBlur={() => {
                      onBlur?.();
                      setIsFocused(false);
                    }}
                    itemContainerStyle={props.itemContainerStyle}
                    key={props.keyToCompareData}  

                  />
                ) : (
                  <MultiSelect
                    mode={"auto"}
                    style={[
                      styles.input,
                      errStyle,
                      props.inputStyle,
                      {
                        backgroundColor: Colors[theme].background,
                        shadowColor: Colors[theme].background,
                      },
                    ]}
                    inputSearchStyle={[
                      styles.inputSearchStyle,
                      {
                        color: Colors[theme].text,
                        backgroundColor: Colors[theme].input,
                      },
                    ]}
                    itemTextStyle={[
                      styles.showText,
                      {
                        color: Colors[theme].text,
                      },
                    ]}
                    dropdownPosition={props.position ?? "auto"}
                    placeholderStyle={[styles.placeholderStyle]}
                    selectedTextStyle={styles.selectedTextStyle}
                    disable={props.disabled}
                    iconStyle={styles.iconStyle}
                    onFocus={() => {
                      props.onFocus?.();
                      setIsFocused(true);
                    }}
                    iconColor={
                      error
                        ? Colors.red
                        : props.disabled
                        ? Colors.gray
                        : Colors.primary
                    }
                    renderRightIcon={() => dropIcon(value, error, onChange)}
                    search={props.isSearch ?? false}
                    data={props?.data ?? []}
                    labelField={
                      props.keyToShowData ? props.keyToShowData : "label"
                    }
                    valueField={
                      props.keyToCompareData ? props.keyToCompareData : "value"
                    }
                    maxHeight={300}
                    placeholder={props.placeholder}
                    activeColor={Colors.gray}
                    maxSelect={props.maxSelect}
                    searchField={
                      props.searchField ?? props.keyToShowData ?? "label"
                    }
                    searchPlaceholder={props.searchPlaceholder ?? "Search"}
                    containerStyle={styles.inputContainer}
                    showsVerticalScrollIndicator={false}
                    value={value ?? []}
                    keyboardAvoiding={true}
                    onChange={onChange}
                    onBlur={() => {
                      onBlur?.();
                      setIsFocused(false);
                    }}
                    selectedStyle={styles.selectedStyle}
                    renderSelectedItem={renderSelectedItem}
                    key={props.keyToCompareData}
                  />
                )}
              </View>
            )}
            {error && (
              <ThemedText type="default" style={styles.errorText}>
                {error?.message ?? error?.type ?? "This field is required"}
              </ThemedText>
            )}
          </View>
        );
      }}
    />
  );
};

export default CustomValidation;
const styles = ScaledSheet.create({
  container: {
    width: "100%",
  },
  errorText: {
    color: Colors.red,
    left: "5@ms",
  },
  star: {
    color: Colors.red,
    fontSize: "16@ms",
    fontFamily: "medium",
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: "10@ms",
    paddingHorizontal: "12@ms",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: "16@ms",
    paddingVertical: "10@vs",
  },

  selectedItem: {
    borderRadius: "10@ms",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "8@vs",
    paddingVertical: "5@vs",
    margin: "5@ms",
    gap: "5@ms",
  },
  selectedItemText: {
    fontSize: "14@s",
    fontFamily: "medium",
    color: Colors.black,
  },
  inputContainerStyle: {
    width: "100%",
    height: "50@vs",
    borderBottomWidth: 0,
  },
  dropDownInput: {
    borderRadius: "10@ms",
    borderWidth: 1,
    paddingHorizontal: "12@ms",
    paddingVertical: "10@vs",
  },
  icon: {
    marginRight: "10@ms",
  },
  placeholderStyle: {
    fontSize: "14@s",
    textTransform: "capitalize",
    fontFamily: "medium",
    color: Colors.gray,
  },

  selectedTextStyle: {
    fontSize: "14@s",
  },
  iconStyle: {
    width: "20@ms",
    height: "20@vs",
    // alignSelf: "flex-end"
  },
  inputSearchStyle: {
    fontSize: "14@s",
    borderRadius: "5@ms",
    paddingHorizontal: "10@ms",
    paddingVertical: "5@vs",
  },
  selectedStyle: {
    borderRadius: "10@ms",
  },
  showText: {
    fontSize: "14@s",
    fontFamily: "medium",
  },
  itemTextStyle: {
    fontSize: "14@s",
  },
});
