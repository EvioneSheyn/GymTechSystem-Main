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
import { ExerciseImages } from "../../../sample-data/Exercises";
import api from "../../Axios";

// const exercises = [
//   {
//     name: "Treadmill",
//     details: "8 min., 110–140bpm",
//     image: require("root/assets/exercises/treadmill.jpg"),
//   },
//   {
//     name: "Hammer strength chest bench press",
//     details: "3x15x20 kg",
//     image: require("root/assets/exercises/chestpress.jpg"),
//   },
//   {
//     name: "Close-grip front lat pulldown",
//     details: "3x15x35 kg",
//     image: require("root/assets/exercises/latpulldown.jpg"),
//   },
//   {
//     name: "30-degree incline dumbbell fly",
//     details: "3x15x6 kg",
//     image: require("root/assets/exercises/fly.jpg"),
//   },
//   {
//     name: "Standing rope pullover",
//     details: "3x15x20 kg",
//     image: require("root/assets/exercises/ropepullover.jpg"),
//   },
//   {
//     name: "Hanging leg raises",
//     details: "3x15",
//     image: require("root/assets/exercises/legraises.jpg"),
//   },

//   // ✅ Added Stretching Exercises Below
//   {
//     name: "Shoulder joint stretch",
//     details: "1x30 s",
//     image: require("root/assets/exercises/shoulderstretch.jpg"),
//   },
//   {
//     name: "Chest muscle stretch",
//     details: "1x30 s",
//     image: require("root/assets/exercises/cheststretch.jpg"),
//   },
//   {
//     name: "Deltoids stretch",
//     details: "1x20 s",
//     image: require("root/assets/exercises/deltoidstretch.jpg"),
//   },
//   {
//     name: "Overhead triceps stretch",
//     details: "1x20 s",
//     image: require("root/assets/exercises/tricepsstretch.jpg"),
//   },
//   {
//     name: "Oblique & lat side reach stretch",
//     details: "1x20 s",
//     image: require("root/assets/exercises/obliquestretch.jpg"),
//   },
//   {
//     name: "Spine extensor muscles stretch",
//     details: "1x30 s",
//     image: require("root/assets/exercises/spinestretch.jpg"),
//   },
// ];

export default function WorkoutExercisesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { routineId } = route.params;
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExerciseSets = async () => {
      try {
        const response = await api.get(
          "/api/routine-sets/" + routineId
        );

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
              <Text style={styles.exerciseName}>
                {item.exercise.name}
              </Text>
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
