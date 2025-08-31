import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import React, { memo, useEffect, useState } from "react";
import { WhiteText } from "@/Components/WhiteText";

import { Calendar, CalendarProvider } from "react-native-calendars";
import { TextInput } from "react-native-paper";

import RNDateTimePicker from "@react-native-community/datetimepicker";

const RNCalendar = ({ setRecordedDates, recordedDates }) => {
  const [selected, setSelected] = useState({});
  const [markDates, setMarkDates] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRecordedDates = () => {
    let dates = {};

    for (let date of recordedDates) {
      date = getLocalISOString(date);
      console.log("Marked Date: ", date);
      dates = {
        ...dates,
        [date]: { marked: true, backgroundColor: "#50cebb" },
      };
    }

    console.log(dates);
    setMarkDates(dates);
  };

  const handleCloseScheduleForm = () => {
    setShowScheduleForm(false);
    setTitleText("");
  };

  const clearErrorMsg = () => {
    setErrorMsg("");
  };

  const handleAddSchedule = () => {
    if (titleText === "") {
      setErrorMsg("This must be filled!");
      return;
    }

    const selectedPairs = {
      title: titleText,
      record: selected,
    };
    console.log("The selected: ", selected);
    setRecordedDates((prev) => [...prev, selectedPairs]);
    handleCloseScheduleForm();
  };

  const handleTimeChange = (event, selectedISODate) => {
    selectedISODate = selectedISODate.toISOString();

    if (event.type === "set" && selectedISODate) {
      const selectedDate = new Date(selected.dateString);
      const selectedTime = new Date(selectedISODate);

      console.log(selectedTime);

      const dateTimeSelected = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0
      );

      setSelected(dateTimeSelected);
      setShowScheduleForm(true);
    }

    setShowTimePicker(false);
  };

  const getLocalISOString = (ISODateFormatted) => {
    let dateComponents = ISODateFormatted.record
      .toLocaleDateString()
      .split("/");

    return `${dateComponents[2]}-${dateComponents[0].padStart(
      2,
      "0"
    )}-${dateComponents[1].padStart(2, "0")}`;
  };

  useEffect(() => {
    console.log(recordedDates);

    fetchRecordedDates();
  }, [recordedDates]);

  return (
    <CalendarProvider>
      <Calendar
        // Customize the appearance of the calendar
        minDate={new Date()}
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
          textDisabledColor: "#777",
        }}
        enableSwipeMonths
        // Callback that gets called when the user selects a day
        onDayPress={(day) => {
          setSelected(day);

          let date = new Date(day.dateString);
          let dateFormatted = date.toISOString().split("T")[0];

          if (!Object.keys(markDates).includes(dateFormatted)) {
            setShowTimePicker(true);
          } else {
          }
        }}
        // Mark specific dates as marked
        markedDates={{
          [selected?.dateString]: {
            selected: true,
            backgroundColor: "rgba(83, 243, 248, 0.93)",
          },
          ...markDates,
        }}
      />

      {showTimePicker && (
        <View>
          <RNDateTimePicker
            mode="time"
            display="spinner"
            value={new Date()}
            onChange={handleTimeChange}
          />
        </View>
      )}

      {showScheduleForm && (
        <Modal transparent>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>ADD SCHEDULE ON</Text>
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                  }}
                >
                  {selected.toLocaleDateString([], {
                    dateStyle: "full",
                  })}
                </Text>
                <Text
                  style={{
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#444",
                  }}
                >
                  @
                  {selected.toLocaleTimeString([], {
                    timeStyle: "short",
                    hour12: true,
                  })}
                </Text>
                <TextInput
                  style={{
                    backgroundColor: "#b8edfd80",
                  }}
                  label={"Enter activity title"}
                  placeholder="Leg Day!"
                  value={titleText}
                  onChangeText={(text) => setTitleText(text)}
                  error={errorMsg}
                  onFocus={() => clearErrorMsg()}
                />
                {errorMsg && (
                  <Text style={{ color: "red", fontSize: 12 }}>{errorMsg}</Text>
                )}
              </View>
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity
                  style={styles.redButton}
                  onPress={handleCloseScheduleForm}
                >
                  <WhiteText style={{ fontWeight: "bold" }}>Cancel</WhiteText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.blueButton}
                  onPress={handleAddSchedule}
                >
                  <WhiteText style={{ fontWeight: "bold" }}>Add</WhiteText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </CalendarProvider>
  );
};

export default RNCalendar;

const styles = StyleSheet.create({
  modalButtonGroup: {
    gap: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "gray",
  },
  modalView: {
    flexDirection: "column",
    gap: 10,
    width: "90%",
    borderRadius: 12,
    padding: 24,
    backgroundColor: "white",
  },
  blueButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#60aef7ff",
    borderRadius: 12,
  },
  redButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#f76560ff",
    borderRadius: 12,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
