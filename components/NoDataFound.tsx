 
import assets from "@/assets";
import React from "react";
import { Image } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import CustomButton from "./CustomButton";
import { ThemedView } from "./ThemedView";

const NoDataFound = ({
  onPress,
  loading,
  containerStyle,
}: {
  onPress?: () => void;
  loading?: boolean;
  containerStyle?: any;
}) => {
  return (
    <ThemedView style={[containerStyle,{alignItems:"center"}]}>
      <Image
        resizeMode="contain"
        style={styles.imgStyle} 
        source={assets?.images.noDataFound}
      />
      {onPress && (
        <CustomButton
          title="Refresh"
          onPress={() => {}}
          style={{ width: "50%" }}
          isLoading={loading}
        />
      )}
    </ThemedView>
  );
};

export default NoDataFound;

const styles = ScaledSheet.create({
  imgStyle: {
    width: "300@ms",
    height: "300@ms",
    alignSelf: "center",
    marginTop: "100@ms",
  },
});
