import React from "react";
import { Text } from "react-native";

export const WhiteText = ({ children, style }) => (
  <Text style={[{ color: "white" }, style]}>{children}</Text>
);
