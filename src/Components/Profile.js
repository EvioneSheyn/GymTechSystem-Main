import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Keyboard } from "react-native";
import api from "@/Axios";
import { useNavigation } from "@react-navigation/native";

const Profile = ({ profile }) => {
  const defaultForm = {
    height: "",
    weight: "",
    gender: "",
  };
  const navigation = useNavigation();

  const [myDate, setMyDate] = useState(new Date("2006-01-01"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const dateChangeHandler = (event, selectedDate) => {
    if (selectedDate) {
      setMyDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting..", {
        dateOfBirth: myDate.toISOString(),
        ...form,
      });

      const response = await api.post("/api/create-profile", {
        dateOfBirth: myDate.toISOString(),
        ...form,
      });
      console.log("Submitting..");

      if (response.status === 200) {
        alert("Profile created successfully!");
        navigation.navigate("MainNavigator", {
          screen: "Dashboard",
        });

        profile.setProfile(response.data.profile);
      }
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        const errorMessages = errors.map((err) => err.msg).join("\n");
        alert("Error: " + errorMessages);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Setup Profile</Text>
      <View style={{ marginTop: 100 }}>
        <View style={styles.profileContainer}>
          <Button
            onPress={() => handleFormChange("gender", "Female")}
            style={{
              borderWidth: 2,
              borderColor:
                form.gender === "Female" ? "green" : "transparent",
            }}
          >
            <View style={[styles.box, { backgroundColor: "pink" }]}>
              <Icon source="gender-female" size={40} color="white" />
            </View>
          </Button>
          <Button
            onPress={() => handleFormChange("gender", "Male")}
            style={{
              borderWidth: 2,
              borderColor:
                form.gender === "Male" ? "green" : "transparent",
            }}
          >
            <View
              style={[styles.box, { backgroundColor: "#4e8cff" }]}
            >
              <Icon source="gender-male" size={40} color="white" />
            </View>
          </Button>
        </View>
      </View>

      <View style={{ marginTop: 20, gap: 12 }}>
        <TextInput
          style={{ flexGrow: 1, backgroundColor: "white" }}
          label={"Date of Birth"}
          value={myDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
          onPress={() => {
            Keyboard.dismiss();
            setShowDatePicker(true);
          }}
          showSoftInputOnFocus={false}
        />

        <TextInput
          label="Height (cm)"
          keyboardType="numeric"
          style={{ backgroundColor: "white" }}
          value={form.height}
          onChangeText={(text) => handleFormChange("height", text)}
        />

        <TextInput
          label="Weight (kg)"
          keyboardType="numeric"
          style={{ backgroundColor: "white" }}
          value={form.weight}
          onChangeText={(text) => handleFormChange("weight", text)}
        />

        <Button
          icon="check"
          mode="contained"
          style={{ backgroundColor: "#4e8cff", marginTop: 20 }}
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={myDate}
          mode="date" // "time" or "datetime"
          display="default"
          maximumDate={new Date("2006-12-31")}
          onChange={dateChangeHandler}
        />
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#333",
    borderRadius: 14,
    height: 80,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#0f172a",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
