// Workouts.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Workouts({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#38bdf8" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Gender Section */}
      <View style={styles.genderSection}>
        <Text style={styles.title}>Choose Gender</Text>

        {/* Male Option - Navigates to MaleWorkoutPlans */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("MaleWorkoutPlans")}
        >
          <Image source={require("./assets/male.jpg")} style={styles.cardImage} />
          <View style={styles.overlay} />
          <Text style={styles.cardText}>Male</Text>
        </TouchableOpacity>

        {/* Female Option - Navigates to FemaleWorkoutPlans */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("FemaleWorkoutPlans")}
        >
          <Image source={require("./assets/female.jpg")} style={styles.cardImage} />
          <View style={styles.overlay} />
          <Text style={styles.cardText}>Female</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38bdf8",
    marginLeft: 8,
    fontFamily: "poppins",
  },
  genderSection: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 30,
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
