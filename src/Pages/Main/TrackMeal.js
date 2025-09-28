import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { RadioButton } from "@/Components/RadioButton";
import { useNavigation } from "@react-navigation/native";
import { WhiteText } from "@/Components/WhiteText";
import { api } from "@/Axios";
import { PieChart } from "react-native-gifted-charts";
import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";

const today = new Date();
const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundGradientFrom: "#1e2229ff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#080a13ff",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(37, 146, 219, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: true, // optional
};

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + i);
  const isoDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD local

  return {
    key: isoDate,
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate().toString().padStart(2, "0"),
  };
});

const DateComponent = ({ day, dayOfWeek, selected = false, onPress }) => (
  <TouchableOpacity
    style={[styles.dateComponent, selected && { backgroundColor: "#38bdf8" }]}
    onPress={onPress}
  >
    <WhiteText
      style={{
        fontWeight: "500",
        fontSize: 14,
        color: selected ? "black" : "white",
      }}
    >
      {day}
    </WhiteText>
    <WhiteText
      style={{
        color: "gray",
        fontSize: 10,
        color: selected ? "#333" : "white",
      }}
    >
      {dayOfWeek}
    </WhiteText>
  </TouchableOpacity>
);

const TrackMeal = () => {
  const [selectedValue, setSelectedValue] = useState("Day");
  const [selectedDate, setSelectedDate] = useState(
    today.toLocaleDateString("en-CA")
  );
  const options = ["Day", "Week", "Month", "Year"];
  const navigation = useNavigation();
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [calorieReportData, setCalorieReportData] = useState({});

  useEffect(() => {
    fetchMeals();
    fetchCaloriesBurned();
    fetchCalorieReport();
  }, [selectedDate]);

  const handleSelect = (isodate) => {
    setSelectedDate(isodate);
  };

  const fetchMeals = async () => {
    try {
      const response = await api.post("/api/meal/total", {
        date: selectedDate,
      });

      if (response.status === 200) {
        setTotalCalories(Number(response.data.totalCalories) || 0);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch meals");
      setTotalCalories(0); // fallback
    }
  };

  const fetchCaloriesBurned = async () => {
    try {
      const date = new Date(`${selectedDate}`);

      console.log("TODAY DATE: ", date, selectedDate);
      const response = await api.post("/api/workout/by-date", {
        date,
      });

      if (response.status === 200) {
        setTotalCaloriesBurned(Number(response.data.caloriesBurned) || 0);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch workouts");
      setTotalCaloriesBurned(0); // fallback
    }
  };

  const fetchCalorieReport = async () => {
    try {
      const response = await api.get("/api/report/calorie");

      const reportData = response.data.reportData;
      const burnedList = reportData.last5Days.map(
        (day) => reportData.burnedResult?.[day] ?? 0
      );
      const intakeList = reportData.last5Days.map(
        (day) => reportData.mealsTaken?.[day] ?? 0
      );
      const formattedDates = reportData.last5Days.map((d) =>
        format(parseISO(d), "MMM d")
      );
      console.log("nigana");

      const chartData = {
        labels: formattedDates,
        burnedList: burnedList,
        intakeList: intakeList,
      };

      console.log("Calorie Report: ", chartData);
      setCalorieReportData(chartData);
    } catch (error) {
      console.log(
        "Error retrieving calorie report: " + error.response.data.error
      );
    }
  };

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
            selected={selectedDate === day.key}
            onPress={() => handleSelect(day.key)}
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
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.statText}>
            {totalCaloriesBurned}
          </Text>
          <Text style={{ color: "#777" }}>Burn</Text>
        </TouchableOpacity>
        <View>
          <PieChart
            data={[
              totalCalories > 0 && {
                value: totalCalories,
                color: "#7bee77ff",
              },
              totalCaloriesBurned > 0 && {
                value: totalCaloriesBurned,
                color: "#f15353ff",
              },
              totalCalories <= 0 &&
                totalCaloriesBurned <= 0 && {
                  value: 100,
                  color: "#838383ff",
                },
            ].filter(Boolean)}
            innerRadius={40}
            innerCircleColor={"#242936ff"}
            radius={55}
            donut
          />
          <View>
            <Text style={{ color: "white", textAlign: "center" }}>Workout</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.greenBox}
          onPress={() => {
            navigation.navigate("MainNavigator", {
              screen: "Meal",
            });
          }}
        >
          <Text>🍽️</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.statText}>
            {totalCalories}
          </Text>
          <Text style={{ color: "#777" }}>Eaten</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.optionsContainer}>
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
          //TODO removed for now
        ))}
      </View> */}
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          backgroundColor: "#b1d1f5ff",
          marginTop: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: "#0066ffff",
          alignItems: "center",
          justifyContent: "start",
          paddingVertical: 8,
          paddingHorizontal: 4,
          marginBottom: 24,
        }}
      >
        <MaterialIcons
          name={"info"}
          style={{ color: "#2b8effff", fontSize: 24 }}
        />
        <Text style={{ fontSize: 11 }}>
          Do not forget to track your meal everyday and exercise!
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {calorieReportData && (
          <LineChart
            data={{
              labels: calorieReportData.labels ?? ["", ""],
              datasets: [
                {
                  data: calorieReportData.burnedList ?? [0, 0],
                  color: (opacity = 1) => `rgba(237, 73, 73, ${opacity})`, // line color
                  strokeWidth: 5,
                },
                {
                  data: calorieReportData.intakeList ?? [0, 0],
                  color: (opacity = 1) => `rgba(0, 96, 252, ${opacity})`, // line color
                  strokeWidth: 5,
                },
              ],
              legend: ["Calorie Burned", "Calorie Eaten"],
            }}
            width={screenWidth}
            height={200}
            style={{ paddingBottom: 24 }}
            verticalLabelRotation={30}
            chartConfig={chartConfig}
            bezier
          />
        )}
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
    height: 70,
    width: 60,
    borderRadius: 12,
    padding: 5,
  },
  orangeBox: {
    alignItems: "center",
    backgroundColor: "#eeb696ff",
    height: 70,
    padding: 5,
    borderRadius: 12,
    width: 60,
  },
  statText: {
    fontSize: 18,
    fontWeight: "500",
    flexGrow: 1,
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
