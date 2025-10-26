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
import { Alert } from "react-native";

const largeArmsExercises = [
  {
    id: 1,
    name: "Barbell Curl",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80",
    details: "4 sets x 12 reps"
  },
  {
    id: 2,
    name: "Hammer Curl",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80",
    details: "3 sets x 15 reps"
  },
  {
    id: 3,
    name: "Tricep Extension",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80",
    details: "4 sets x 10 reps"
  }
];

export default function LargeArmsExercises() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Exercises</Text>

      {largeArmsExercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseContainer}>
          {exercise.image && (
            <Image
              source={{ uri: exercise.image }}
              style={styles.exerciseImage}
              contentFit="cover"
              placeholder="🏋️"
              transition={200}
            />
          )}
          <View style={styles.textContent}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.details}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          navigation.navigate("BeginWorkout", {
            exercises: largeArmsExercises,
          });
        }}
      >
        <Text style={styles.startText}>BEGIN WORKOUT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
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
