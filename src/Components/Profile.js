import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button, TextInput } from "react-native-paper";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Keyboard } from "react-native";
import { api } from "@/Axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ setProfile }) => {
  const defaultForm = {
    height: "",
    weight: "",
    gender: "",
  };
  const navigation = useNavigation();

  const [myDate, setMyDate] = useState(new Date("2006-01-01"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [page, setPage] = useState(0);

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

    setPage(1);
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
        setProfile(response.data.profile);

        await AsyncStorage.setItem(
          "profile",
          JSON.stringify(response.data.profile)
        );
      }
    } catch (error) {
      const errors = error.response.data.errors;
      console.log("Error on creating profile: ", error.response.data.message);
      if (errors) {
        const errorMessages = errors.map((err) => err.msg).join("\n");
        alert("Error: " + errorMessages);
      }
    }
  };

  return (
    <View style={styles.container}>
      {page === 1 && (
        <TouchableOpacity onPress={() => setPage(0)} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#38bdf8" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>Setup Profile</Text>
      {page === 0 && (
        <View style={styles.genderSection}>
          <Text style={styles.title}>Choose Gender</Text>

          {/* Male Option - Navigates to MaleWorkoutPlans */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleFormChange("gender", "Male")}
          >
            <Image
              source={require("root/assets/male.jpg")}
              style={styles.cardImage}
            />
            <View style={styles.overlay} />
            <Text style={styles.cardText}>Male</Text>
          </TouchableOpacity>

          {/* Female Option - Navigates to FemaleWorkoutPlans */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleFormChange("gender", "Female")}
          >
            <Image
              source={require("root/assets/female.jpg")}
              style={styles.cardImage}
            />
            <View style={styles.overlay} />
            <Text style={styles.cardText}>Female</Text>
          </TouchableOpacity>
        </View>
      )}

      {page === 1 && (
        <View style={{ marginTop: 20, gap: 12 }}>
          <Text style={styles.title}>Fill up details</Text>
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
      )}

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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38bdf8",
    marginLeft: 8,
    fontFamily: "poppins",
  },
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
  genderSection: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 60,
    fontFamily: "poppins",
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1.5,
    borderColor: "#38bdf855",
    backgroundColor: "#1e293b",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  cardText: {
    position: "absolute",
    bottom: 16,
    left: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#f8fafc",
    fontFamily: "poppins",
  },
});
