// WorkoutExercisesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ExerciseImages } from "root/sample-data/Exercises";
import { api } from "@/Axios";

export default function WorkoutExercisesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { routineId } = route.params;
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExerciseSets = async () => {
      try {
        const response = await api.get("/api/plans/sets/" + routineId);

        let exercises = response.data.sets;
        setExercises(exercises);
      } catch (error) {
        console.error(
          "Error fetching routine sets: ",
          error.response.data.message
        );
      }
    };

    fetchExerciseSets();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Exercises</Text>
        <TouchableOpacity>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {exercises.map((item, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Image
              source={ExerciseImages[item.exercise.image]}
              style={styles.exerciseImage}
            />
            <View style={styles.exerciseText}>
              <Text style={styles.exerciseName}>{item.exercise.name}</Text>
              <Text style={styles.exerciseDetails}>
                {item.count} Sets x {item.value}{" "}
                {item.type === "Reps" ? "reps" : "secs"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("BeginWorkout", {
            exercises,
            routineId,
          });
        }}
      >
        <Text style={styles.buttonText}>BEGIN WORKOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  skipText: {
    color: "#06b6d4",
    fontWeight: "600",
  },
  scroll: {
    paddingHorizontal: 20,
    marginBottom: 70,
  },
  exerciseItem: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  exerciseImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  exerciseText: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#64748b",
  },
  button: {
    backgroundColor: "#06b6d4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
