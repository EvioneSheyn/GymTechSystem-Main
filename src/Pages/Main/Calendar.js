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
import PagesLayout from "../../Layouts/PagesLayout";

const Calendar = () => {
  const navigation = useNavigation();
  const [fireDates, setFireDates] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      try {
        const response = await api.get("/api/all-workout-sessions");

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

  const isBeforeToday = (dateString) => {
    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < currentDay;
  };

  return (
    <PagesLayout>
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          Schedule
        </Text>
        <Text
          style={{
            color: "white",
            marginTop: 12,
          }}
        >
          Select a date:
        </Text>
      </View>
      <CalendarComponent
        minDate={today}
        style={{
          borderRadius: 24,
          overflow: "hidden",
          marginTop: 4,
          paddingBottom: 10,
        }}
        theme={{
          calendarBackground: "#1e293b",
          dayTextColor: "#fff",
          textSectionTitleColor: "#fff",
          monthTextColor: "#fff",
        }}
        dayComponent={({ date, state }) => {
          const isFireDay = fireDates.includes(date.dateString);

          return (
            <TouchableOpacity
              disabled={isBeforeToday(date.dateString)}
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
                      backgroundColor:
                        date.dateString === today ? "#41badb" : "",
                      borderRadius: 24,
                      paddingHorizontal: 6,
                      paddingVertical: 5,
                    }}
                  >
                    {date.day}
                  </Text>
                </View>
                {isFireDay && (
                  <Text
                    style={{
                      fontSize: 12,
                      position: "absolute",
                      bottom: -8,
                    }}
                  >
                    🔥
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View
        style={{
          marginTop: 12,
        }}
      >
        <Text style={{ color: "white" }}>Select a period:</Text>
      </View>
    </PagesLayout>
  );
};

export default Calendar;

const styles = StyleSheet.create({});
