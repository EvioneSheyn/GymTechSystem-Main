import React from "react";
import { View, Text } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

function Loader() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f172a",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <ActivityIndicator size={100} color={MD2Colors.blue500} />
      <Text style={{ color: MD2Colors.blue500 }}>Loading</Text>
    </View>
  );
}

export default Loader;
