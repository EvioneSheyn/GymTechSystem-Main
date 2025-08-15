import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Calendar as CalendarComponent } from "react-native-calendars";
import api from "@/Axios";

const Calendar = () => {
  const navigation = useNavigation();
  const [fireDates, setFireDates] = useState([]);

  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      try {
        const response = await api.get("/api/workout-sessions");

        const sessions = response.data.sessions;
        let dates = sessions.map(
          (session) => session.createdAt.split("T")[0]
        );

        setFireDates(dates);
      } catch (error) {
        console.error(
          "Fetching Workout Error: ",
          error.response.data
        );
      }
    };

    fetchWorkoutSessions();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 50,
        backgroundColor: "#0f172a",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5
            name="arrow-left"
            style={{
              fontSize: 24,
              color: "#ddd",
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            flexGrow: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            color: "white",
          }}
        >
          Calendar
        </Text>
      </View>
      <CalendarComponent
        style={{
          borderRadius: 24,
          overflow: "hidden",
          marginTop: 24,
          paddingBottom: 10,
        }}
        theme={{
          calendarBackground: "#1e293b",
          dayTextColor: "#fff",
          textSectionTitleColor: "#fff",
          monthTextColor: "#fff",
          textDayFontWeight: "500",
        }}
        dayComponent={({ date, state }) => {
          const isFireDay = fireDates.includes(date.dateString);

          return (
            <TouchableOpacity
              onPress={() => {
                setFireDates((prev) => [...prev, date.dateString]);
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: state === "disabled" ? "gray" : "white",
                    }}
                  >
                    {date.day}
                  </Text>
                </View>
                {isFireDay && (
                  <Text style={{ fontSize: 12 }}>🔥</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({});
