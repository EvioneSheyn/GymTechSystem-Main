// WorkoutDetailsFemale.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WorkoutDetailsFemale({ route, navigation }) {
  const { title, image } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#38bdf8" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Workout Plan</Text>
      </View>

      {/* Image + Title */}
      <ImageBackground
        source={image}
        style={styles.image}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.overlay} />
        <Text style={styles.planTitle}>{title}</Text>
      </ImageBackground>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.info}>
          - 32 workout days (4 sessions/week: 2 strength + 2 cardio)
        </Text>
        <Text style={styles.info}>
          - Specific nutrition guide and meal plans
        </Text>
        <Text style={styles.info}>
          - Recommended sports supplements
        </Text>
        <Text style={styles.info}>
          Categories:{" "}
          <Text style={styles.bold}>for women, for the gym, beginner</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>START</Text>
      </TouchableOpacity>

      {/* Description */}
      <Text style={styles.description}>
        When you see a woman with a beautiful body, it’s not magic—it’s
        discipline, planning, and consistent effort. This program is designed to
        reshape your body while supporting your wellness through meal guidance,
        structured workouts, and a motivational path to your goal.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingTop: 10, // added to push it down
  },
  backButton: {
    marginTop: 8,
    padding: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#0f172a",
  },
  image: {
    height: 160,
    justifyContent: "flex-end",
    padding: 16,
    marginBottom: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
  planTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoBox: {
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#06b6d4",
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: "#1e293b",
    lineHeight: 20,
  },
});