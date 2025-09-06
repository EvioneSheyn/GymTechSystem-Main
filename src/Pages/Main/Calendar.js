import { StyleSheet, Text, TouchableOpacity, Modal, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import api from "@/Axios";
import PagesLayout from "../../Layouts/PagesLayout";
import { WhiteText } from "@/Components/WhiteText";
import RNCalendar from "../../Components/RNCalendar";

const Calendar = () => {
  const navigation = useNavigation();
  const [fireDates, setFireDates] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const today = new Date();
  const [scheduledDate, setScheduledDate] = useState(new Date());

  const [recordedDates, setRecordedDates] = useState([]);
  const [formattedRecordedDates, setFRD] = useState({});

  useEffect(() => {
    let formattedRecords = {};

    for (let recordPair of recordedDates) {
      let record = recordPair.record.toLocaleString([], {
        dateStyle: "long",
        timeStyle: "short",
      });
      let splittedRecord = record.split(",");

      let month = splittedRecord[0].split(" ")[0];
      let day = splittedRecord[0].split(" ")[1].padStart(2, "0");
      let year = splittedRecord[1];
      let time = splittedRecord[2];
      let title = recordPair.title;

      if (formattedRecords[year]) {
        if (formattedRecords[year][month]) {
          formattedRecords[year][month].push({ day, title, time });
        } else {
          formattedRecords[year][month] = [{ day, title, time }];
        }
      } else {
        formattedRecords[year] = {
          [month]: [{ day, title, time }],
        };
      }
    }

    setFRD(formattedRecords);
  }, [recordedDates]);

  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      try {
        const response = await api.get("/api/all-workout-sessions");

        const sessions = response.data.sessions;
        let dates = sessions.map((session) => {
          const sessionDateCreated = session.createdAt.split("T")[0];
          const sessionDate = new Date(sessionDateCreated);

          return sessionDate.toLocaleDateString;
        });

        setFireDates(dates);
      } catch (error) {
        console.error("Fetching Workout Error: ", error.response.data);
      }
    };

    fetchWorkoutSessions();
  }, []);

  
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
      </View>
      <RNCalendar
        setRecordedDates={setRecordedDates}
        recordedDates={recordedDates}
      />

      <View style={{ marginTop: 24, marginBottom: 150 }}>
        {Object.keys(formattedRecordedDates).length === 0 && (
          <View>
            <WhiteText>No schedule yet..</WhiteText>
          </View>
        )}

        {Object.entries(formattedRecordedDates).map(([year, record], index) => (
          <View key={index}>
            {/* <WhiteText style={{ fontSize: 38, fontWeight: "bold" }}>
              {year}
            </WhiteText> */}
            {Object.entries(record).map(([month, item], i) => (
              <View
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  marginTop: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 6,
                    alignItems: "baseline",
                  }}
                >
                  <WhiteText style={{ fontSize: 24, fontWeight: "bold" }}>
                    {month}
                  </WhiteText>
                  <WhiteText
                    style={{ fontSize: 12, fontWeight: "bold", color: "gray" }}
                  >
                    {year}
                  </WhiteText>
                </View>
                {item.map((record, index) => (
                  <ScheduleDate />
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>
    </PagesLayout>
  );
};

export default Calendar;

const styles = StyleSheet.create({});

// <View
//   style={{
//     marginTop: 12,
//   }}
// >
// </View>
// )}
