import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";

const RadioButton = ({ selected, onPress, label, style, color }) => (
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

const WhiteText = ({ children, style }) => (
  <Text style={[{ color: "white" }, style]}>{children}</Text>
);

const ProgressPage = () => {
  const [selectedValue, setSelectedValue] = useState("Week");

  const options = ["Week", "Month", "Year", "All"];

  return (
    <PagesLayout>
      <View>
        <Text style={styles.subHeader}>Details of</Text>
        <Text style={styles.mainHeader}>Weight Progress</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((item, index) => (
          <RadioButton
            style={{
              paddingHorizontal: 24,
              paddingVertical: 8,
              backgroundColor:
                selectedValue === item ? "#94a3b8" : "transparent",
              borderRadius: 24,
            }}
            color={"white"}
            label={item}
            key={index}
            selected={selectedValue === item}
            onPress={() => setSelectedValue(item)}
          />
        ))}
      </View>
      <View
        style={{
          height: 250,
          width: "100%",
          backgroundColor: "#1e293b",
          borderRadius: 16,
          marginTop: 16,
        }}
      ></View>
      <View style={{ marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#aaa" }}>
            Lost{" "}
            <Text style={{ fontWeight: "bold", color: "white" }}>
              20
            </Text>{" "}
            kg
          </Text>
          <Text style={{ color: "#aaa" }}>
            Remaining{" "}
            <Text style={{ fontWeight: "bold", color: "white" }}>
              20
            </Text>{" "}
            kg
          </Text>
        </View>
        <View style={styles.outerBar}>
          <View style={styles.innerBar}></View>
        </View>
      </View>

      <Text
        style={{
          color: "#aaa",
          fontSize: 16,
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        My Goals
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.goalContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Weight
            </Text>
          </View>
          <WhiteText style={{ color: "#aaa", fontSize: 32 }}>
            <WhiteText style={{ fontWeight: "bold" }}>60</WhiteText>{" "}
            Kg
          </WhiteText>
        </View>
        <View style={styles.goalContainer}></View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#222",
          borderRadius: 24,
          padding: 16,
          width: "100%",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Add Current Weight
        </Text>
      </TouchableOpacity>
    </PagesLayout>
  );
};

export default ProgressPage;

const styles = StyleSheet.create({
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
});
