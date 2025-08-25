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
import api from "@/Axios";
import { PieChart } from "react-native-gifted-charts";
import { LineChart } from "react-native-chart-kit";

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

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(237, 73, 73, ${opacity})`, // line color
      strokeWidth: 5,
    },
    {
      data: [30, 65, 2, 80, 59, 73],
      color: (opacity = 1) => `rgba(0, 96, 252, ${opacity})`, // line color
      strokeWidth: 5,
    },
  ],
  legend: ["Calorie Burned", "Calorie Eaten"],
};

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + i);

  const isoDate = date.toISOString().split("T")[0];

  return {
    key: isoDate,
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate().toString().padStart(2, "0"),
  };
});

const DateComponent = ({
  day,
  dayOfWeek,
  selected = false,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.dateComponent,
      selected && { backgroundColor: "#38bdf8" },
    ]}
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
    today.toISOString().split("T")[0]
  );
  const options = ["Day", "Week", "Month", "Year"];
  const navigation = useNavigation();

  const [totalCalories, setTotalCalories] = useState("0");
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState("0");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await api.get("/api/total-meal");

        if (response.status === 200) {
          setTotalCalories(response.data.totalCalories);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    fetchMeals();
  }, [totalCalories]);

  useEffect(() => {
    const fetchCaloriesBurned = async () => {
      try {
        const response = await api.get("/api/workout-sessions");

        if (response.status === 200) {
          console.log("Choy: ", response.data.sessions);
          setTotalCaloriesBurned(response.data.caloriesBurned);
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    };

    fetchCaloriesBurned();
  }, [totalCaloriesBurned]);

  const handleSelect = (isodate) => {
    setSelectedDate(isodate);

    // fetchCalorieReport();
  };

  const fetchCalorieReport = async () => {
    try {
      const response = await api.get("/");
      // TODO add meal
    } catch (error) {
      console.log(
        "Date filter selection error: ",
        error.response.data.message
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
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.statText}
          >
            {totalCaloriesBurned}
          </Text>
          <Text style={{ color: "#777" }}>Burn</Text>
        </TouchableOpacity>
        <View>
          <PieChart
            data={[
              {
                value: Number(totalCalories),
                color: "#7bee77ff",
              },
              {
                value: Number(totalCaloriesBurned),
                color: "#f15353ff",
              },
            ]}
            innerRadius={40}
            innerCircleColor={"#242936ff"}
            radius={55}
            donut
          />
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
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.statText}
          >
            {totalCalories}
          </Text>
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
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LineChart
          data={data}
          width={screenWidth}
          height={256}
          verticalLabelRotation={30}
          chartConfig={chartConfig}
          bezier
        />
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
