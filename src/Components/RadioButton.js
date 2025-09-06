import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const RadioButton = ({ selected, onPress, label, style, color }) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
    <View style={[styles.circle, selected && styles.selectedCircle]}>
      {selected && <View style={styles.innerCircle} />}
    </View>
    <Text style={[styles.label, { color: color }]}>{label}</Text>
  </TouchableOpacity>
);

export const styles = StyleSheet.create({
  mainHeader: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
  },
  goalContainer: {
    height: 100,
    width: "48%",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 14,
  },
  optionsContainer: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 16,
  },
  outerBar: {
    backgroundColor: "#aaa",
    width: "100%",
    height: 10,
    borderRadius: 24,
    overflow: "hidden",
  },
  innerBar: {
    backgroundColor: "#333",
    width: "50%",
    height: "100%",
    borderRadius: 24,
  },
  modalCenterView: {
    backgroundColor: "white",
    height: 200,
    width: 300,
    zIndex: 11,
    borderRadius: 12,
    padding: 14,
  },
  modalSubText: {
    fontWeight: 600,
    color: "#6e6e6ede",
    fontSize: 12,
  },
  modalTitleText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalInputView: {
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#160c0cff",
    borderRadius: 12,
    marginVertical: 12,
  },
  modalButtonGroupView: {
    flexDirection: "row",
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 6,
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#3ad",
    borderRadius: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(221,81,81,1)",
    borderRadius: 12,
  },
  addCurrentWeighButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 16,
    width: "100%",
    marginTop: 16,
  },
});
