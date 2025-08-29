import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Calendar as CalendarComponent } from "react-native-calendars";
import api from "@/Axios";
import PagesLayout from "../../Layouts/PagesLayout";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { WhiteText } from "@/Components/WhiteText";
import { TextInput } from "react-native-paper";

const Calendar = () => {
  const navigation = useNavigation();
  const [fireDates, setFireDates] = useState([]);
  const today = new Date();
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      try {
        const response = await api.get("/api/all-workout-sessions");

        const sessions = response.data.sessions;
        let dates = sessions.map(
          (session) => session.createdAt.split("T")[0]
        );

        console.log(response.data.sessions);

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

  const handleScheduling = (calendarDate) => {
    setScheduledDate(new Date(calendarDate));
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      // User picked a time
      const currentDate = new Date(scheduledDate);

      const mergedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0
      );

      console.log(mergedDate);

      setScheduledDate(mergedDate);
    }
    setShowTimePicker(false);
  };

  const getColoredDate = (date) => {
    let color = "";

    switch (date.dateString) {
      case extractDate(today):
        color = "#41badb";
        break;
      case extractDate(scheduledDate):
        color = "#db9d41ff";
        break;
      default:
        color = "";
        break;
    }

    return color;
  };

  const extractDate = (rawDate) => {
    return rawDate.toISOString().split("T")[0];
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
              onPress={() => handleScheduling(date.dateString)}
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
                      backgroundColor: getColoredDate(date),
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
        {showScheduleForm && (
          <Modal transparent>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}

            >
              <View
                style={{
                  flexDirection: "column",
                  gap: 10,
                  height: 300,
                }}
              >
                <Text style={{ marginBottom: 12 }}>
                  Schedule for:{" "}
                  {scheduledDate.toLocaleString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // or false for 24h format
                  })}
                </Text>
                <View>
                  <TextInput label={"Title"} />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
      {showTimePicker && (
        <View>
          <RNDateTimePicker
            mode="time"
            display="spinner"
            value={scheduledDate}
            onChange={handleTimeChange}
          />
        </View>
      )}
    </PagesLayout>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
