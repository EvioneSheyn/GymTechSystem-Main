import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const plans = [
  { title: "WEIGHT LOSS", image: require("./assets/weightloss1.jpg") },
  { title: "SCULPTED BODY", image: require("./assets/sculpted1.jpg") },
  { title: "PERFECT BUTT", image: require("./assets/butt1.jpg") },
  { title: "6 PACK ABS", image: require("./assets/abs1.jpg") },
  { title: "GENERAL MUSCLE BUILDING", image: require("./assets/muscle1.jpg") },
  { title: "POWERLIFTING", image: require("./assets/powerlifting1.jpg") },
  { title: "CROSSFIT", image: require("./assets/crossfit1.jpg") },
  { title: "FULL BODY IN 45 MINUTES", image: require("./assets/fullbody1.jpg") },
  { title: "POSTPARTUM RECOVERY", image: require("./assets/postpartum.jpg") },
];

export default function FemaleWorkoutPlans({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#38bdf8" />
          </TouchableOpacity>
          <Text style={styles.title}>Select your workout plan</Text>
          <Text style={styles.subtitle}>Grouped, Women</Text>
        </View>

        {plans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("WorkoutDetailsFemale", {
                title: plan.title,
                image: plan.image,
              })
            }
          >
            <ImageBackground
              source={plan.image}
              style={styles.image}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.darkOverlay} />
              <Text style={styles.cardText}>{plan.title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { label: "Home", icon: "home", screen: "Dashboard" },
          { label: "Workout", icon: "barbell", screen: "Workout" },
          { label: "Plans", icon: "fitness", screen: "MaleWorkoutPlans" },
        ].map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigation.navigate(btn.screen)}
          >
            <Ionicons name={btn.icon} size={22} color="#38bdf8" />
            <Text style={styles.navText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // extra space for bottom nav
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    fontFamily: "poppins",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    fontFamily: "poppins",
  },
  card: {
    width: screenWidth - 40,
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 16,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "poppins",
  },

  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#334155",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "#38bdf8",
    fontSize: 12,
    marginTop: 2,
    fontFamily: "poppins",
  },
});

