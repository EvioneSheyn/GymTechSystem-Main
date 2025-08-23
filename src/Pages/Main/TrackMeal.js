import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { RadioButton } from "@/Components/RadioButton";
import { useNavigation } from "@react-navigation/native";
import { WhiteText } from "@/Components/WhiteText";

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + i);
  return {
    key: date.getDate() - date.getDay() + i,
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate().toString().padStart(2, "0"),
  };
});

const DateComponent = ({ day, dayOfWeek }) => (
  <View style={styles.dateComponent}>
    <WhiteText style={{ fontWeight: "500", fontSize: 14 }}>
      {day}
    </WhiteText>
    <WhiteText style={{ color: "gray", fontSize: 10 }}>
      {dayOfWeek}
    </WhiteText>
  </View>
);

const TrackMeal = () => {
  const [selectedValue, setSelectedValue] = useState("Day");
  const options = ["Day", "Week", "Month", "Year"];
  const navigation = useNavigation();

  return (
    <PagesLayout>
      <View>
        <Text style={styles.subHeader}>Details of</Text>
        <Text style={styles.mainHeader}>Caloric Balance</Text>
      </View>
      <View style={styles.datesRow}>
        {days.map((day) => (
          <DateComponent
            day={day.date}
            dayOfWeek={day.day}
            key={day.key}
          />
        ))}
      </View>

      <View
        style={{
          marginTop: 12,
          backgroundColor: "#242936ff",
          height: 175,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity style={styles.orangeBox}>
          <Text>🔥</Text>
          <Text style={styles.statText}>390</Text>
          <Text style={{ color: "#777" }}>Burn</Text>
        </TouchableOpacity>
        <View></View>
        <TouchableOpacity
          style={styles.greenBox}
          onPress={() => {
            navigation.navigate("MainNavigator", {
              screen: "Meal",
            });
          }}
        >
          <Text>🍽️</Text>
          <Text style={styles.statText}>536</Text>
          <Text style={{ color: "#777" }}>Eaten</Text>
        </TouchableOpacity>
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
    </PagesLayout>
  );
};

export default TrackMeal;

const styles = StyleSheet.create({
  mainHeader: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
  },
  datesRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dateComponent: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242936ff",
    padding: 12,
    borderRadius: 12,
  },
  greenBox: {
    alignItems: "center",
    backgroundColor: "#d0f1bcff",
    padding: 8,
    width: 60,
    borderRadius: 12,
  },
  orangeBox: {
    alignItems: "center",
    backgroundColor: "#eeb696ff",
    padding: 8,
    borderRadius: 12,
    width: 60,
  },
  statText: {
    fontSize: 18,
    fontWeight: "500",
  },
  optionsContainer: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 16,
  },
});
