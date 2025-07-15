// LargeArmsExercises.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const largeArmsExercises = [
  {
    name: "Treadmill",
    details: "5 min., 110-140bpm",
    image: require("../assets/exercises/treadmill.jpg"),
  },
  {
    name: "Arm circles back",
    details: "1x20",
    image: require("../assets/arm_circles_back.jpg"),
  },
  {
    name: "Arm circles forward",
    details: "1x20",
    image: require("../assets/arm_circles_forward.jpg"),
  },
  {
    name: "Hanging side leg raise",
    details: "4x20",
    image: require("../assets/leg_raise.jpg"),
  },
  {
    name: "Seated pec fly",
    details: "4x12x20 kg",
    image: require("../assets/pec_fly.jpg"),
  },
  {
    name: "Flat bench dumbbell chest press",
    details: "4x10x10 kg",
    image: require("../assets/dumbbell_press.jpg"),
  },
  {
    name: "Machine incline chest press",
    details: "4x12x20 kg",
    image: require("../assets/incline_press.jpg"),
  },
  {
    name: "Chest to floor push-ups",
    details: "4x12",
    image: require("../assets/pushups.jpg"),
  },
  {
    name: "High-pulley curl",
    details: "4x12x15 kg",
    image: require("../assets/pulley_curl.jpg"),
  },
  {
    name: "Elliptical trainer",
    details: "5 min., 110-140bpm",
    image: require("../assets/elliptical.jpg"),
  },
  {
    name: "Chest muscles stretch",
    details: "1x20 s",
    image: require("../assets/chest_stretch.jpg"),
  },
  {
    name: "Hand and shoulder extensor stretch",
    details: "1x20 s",
    image: require("../assets/shoulder_stretch.jpg"),
  },
];

export default function LargeArmsExercises() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Exercises</Text>

      {largeArmsExercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          {exercise.image && (
            <Image source={exercise.image} style={styles.exerciseImage} />
          )}
          <View style={styles.textContent}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>{exercise.details}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startText}>BEGIN WORKOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  backButton: {
    marginTop: 40,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  exerciseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginRight: 15,
  },
  textContent: {
    flexShrink: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
  },
  startButton: {
    backgroundColor: "#06b6d4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  startText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
