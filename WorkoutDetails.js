// WorkoutDetails.js
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
import { useNavigation, useRoute } from "@react-navigation/native";

// Plan-specific details
const workoutDetailsData = {
  "GENERAL MUSCLE BUILDING": {
    details: `- 24 workout days (3 sessions/week)\n- Balanced nutrition plan\n- Basic supplements: whey, creatine`,
    description: `This plan builds lean muscle through compound and isolation exercises. It's structured for full-body development, ideal for beginners and intermediates who want a solid foundation.`,
  },
  "LARGE ARMS": {
    details: `- 4 arm-focused sessions/week\n- Supersets & pyramid sets\n- High protein, low-fat diet`,
    description: `Maximize your bicep and tricep growth with intense high-rep workouts. This program includes targeted arm training to produce serious arm size and definition.`,
  },
  "POWERFUL CHEST": {
    details: `- 3 intense chest workouts/week\n- Incline, flat & decline presses\n- Pre-workout and creatine support`,
    description: `Boost upper-body power with heavy compound presses and fly variations. Ideal for increasing bench press strength and developing chest size and shape.`,
  },
  "WIDE BACK": {
    details: `- Pull & row variations\n- Width + thickness training\n- Stretch & recovery routines`,
    description: `Build a wide, V-tapered back using rows, pull-ups, and deadlifts. This program focuses on improving back aesthetics and strength.`,
  },
  "BIG SHOULDERS": {
    details: `- Focus on deltoid heads\n- Military press & lateral raises\n- Shoulder joint care tips`,
    description: `Train for strong, round shoulders with focused volume and angles. Includes isolation and compound movements for full shoulder development.`,
  },
  "STRONG LEGS": {
    details: `- Heavy squats & deadlifts\n- Hamstring, quad, and glute focus\n- Emphasis on form & control`,
    description: `A powerful leg day split including squats, lunges, and Romanian deadlifts. This plan builds strength, power, and muscle density in the lower body.`,
  },
  "WEIGHT LOSS": {
    details: `- 5 days/week fat-burning workouts\n- HIIT & circuit training\n- Low-carb, calorie-deficit plan`,
    description: `Lose weight effectively with a mix of HIIT, cardio, and resistance training. This plan promotes fat loss while preserving lean muscle mass.`,
  },
  "SCULPTED BODY": {
    details: `- Full-body toning & endurance\n- Core and stability workouts\n- Light weights, high reps`,
    description: `This sculpting plan uses functional movements to define and tone your physique. Excellent for aesthetics and maintaining a healthy, lean look.`,
  },
  "6 PACK ABS": {
    details: `- Daily 15-20 min ab circuits\n- No equipment needed\n- Fat-burning diet included`,
    description: `Get visible abs by combining daily core exercises with proper diet. Focus on lower abs, obliques, and upper abs with high-rep circuits.`,
  },
  POWERLIFTING: {
    details: `- Squat, deadlift, bench press\n- 4-day strength split\n- Recovery and mobility plan`,
    description: `Lift heavy, lift smart. This plan is for those aiming for strength PRs and progressive overload, with proper recovery and joint support.`,
  },
  CROSSFIT: {
    details: `- Functional full-body WODs\n- AMRAP, EMOM, and timed sets\n- Conditioning & strength mix`,
    description: `Push your limits with high-intensity CrossFit sessions. Combine cardio, lifting, and agility to improve full-body performance.`,
  },
  "FULL BODY IN 45 MINUTES": {
    details: `- Quick full-body sessions\n- 3-4 times a week\n- Circuit-style intensity`,
    description: `Short on time? This plan offers fast-paced circuits focusing on all major muscle groups for fat burn and functional strength in under an hour.`,
  },
};

export default function WorkoutDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, image } = route.params;

  const plan = workoutDetailsData[title] || {
    details: "- No specific data available.",
    description: "This workout plan is currently under construction.",
  };

  const handleStartWorkout = () => {
    if (title === "LARGE ARMS") {
      navigation.navigate("LargeArmsExercises");
    } else {
      navigation.navigate("WorkoutExercises", { title });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Workout Plan</Text>

      <Image source={image} style={styles.image} />
      <View style={styles.textOverlay}>
        <Text style={styles.planTitle}>{title}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.details}>{plan.details}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleStartWorkout}
        >
          <Text style={styles.addText}>START</Text>
        </TouchableOpacity>

        <Text style={styles.description}>{plan.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backButton: {
    margin: 16,
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 80,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
  textOverlay: {
    position: "absolute",
    top: 160,
    left: 20,
  },
  planTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsBox: {
    padding: 20,
  },
  details: {
    fontSize: 14,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#06b6d4",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
});
