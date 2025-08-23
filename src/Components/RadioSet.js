import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { RadioButton } from "./RadioButton";

export default function RadioSet({ children, style }) {
  return (
    <ScrollView>
      <View style={[styles.optionsContainer, { style }]}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 16,
  },
});
