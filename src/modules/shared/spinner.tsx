import React from "react";
import { View, ActivityIndicator } from "react-native";

const Spinner = () => {
  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
      }}>
      <ActivityIndicator size="large" color="#008080" />
    </View>
  );
};
export default Spinner;
