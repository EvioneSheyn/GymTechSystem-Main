import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "@/Pages/Main/ProgressPage";

export const RadioButton = ({
  selected,
  onPress,
  label,
  style,
  color,
}) => (
  <TouchableOpacity
    style={[styles.container, style]}
    onPress={onPress}
  >
    <View style={[styles.circle, selected && styles.selectedCircle]}>
      {selected && <View style={styles.innerCircle} />}
    </View>
    <Text style={[styles.label, { color: color }]}>{label}</Text>
  </TouchableOpacity>
);
