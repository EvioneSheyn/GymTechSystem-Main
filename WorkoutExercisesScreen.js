// WorkoutExercisesScreen.js
import React, { useEffect } from "react";
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
import { Exercises } from "./modules/Exercises";

// const exercises = [
//   {
//     name: "Treadmill",
//     details: "8 min., 110–140bpm",
//     image: require("./assets/exercises/treadmill.jpg"),
//   },
//   {
//     name: "Hammer strength chest bench press",
//     details: "3x15x20 kg",
//     image: require("./assets/exercises/chestpress.jpg"),
//   },
//   {
//     name: "Close-grip front lat pulldown",
//     details: "3x15x35 kg",
//     image: require("./assets/exercises/latpulldown.jpg"),
//   },
//   {
//     name: "30-degree incline dumbbell fly",
//     details: "3x15x6 kg",
//     image: require("./assets/exercises/fly.jpg"),
//   },
//   {
//     name: "Standing rope pullover",
//     details: "3x15x20 kg",
//     image: require("./assets/exercises/ropepullover.jpg"),
//   },
//   {
//     name: "Hanging leg raises",
//     details: "3x15",
//     image: require("./assets/exercises/legraises.jpg"),
//   },

//   // ✅ Added Stretching Exercises Below
//   {
//     name: "Shoulder joint stretch",
//     details: "1x30 s",
//     image: require("./assets/exercises/shoulderstretch.jpg"),
//   },
//   {
//     name: "Chest muscle stretch",
//     details: "1x30 s",
//     image: require("./assets/exercises/cheststretch.jpg"),
//   },
//   {
//     name: "Deltoids stretch",
//     details: "1x20 s",
//     image: require("./assets/exercises/deltoidstretch.jpg"),
//   },
//   {
//     name: "Overhead triceps stretch",
//     details: "1x20 s",
//     image: require("./assets/exercises/tricepsstretch.jpg"),
//   },
//   {
//     name: "Oblique & lat side reach stretch",
//     details: "1x20 s",
//     image: require("./assets/exercises/obliquestretch.jpg"),
//   },
//   {
//     name: "Spine extensor muscles stretch",
//     details: "1x30 s",
//     image: require("./assets/exercises/spinestretch.jpg"),
//   },
// ];

const exercises = [...Exercises];

export default function WorkoutExercisesScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // console.log("Exercises: ", exercises);
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
            <Image source={item.image} style={styles.exerciseImage} />
            <View style={styles.exerciseText}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseDetails}>
                {item.details}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("BeginWorkout", {
            exercises
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
