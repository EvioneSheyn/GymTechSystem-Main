import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const plans = [
  {
    title: "GENERAL MUSCLE BUILDING",
    image: require("root/assets/muscle.jpg"),
  },
  { title: "LARGE ARMS", image: require("root/assets/arms.jpg") },
  {
    title: "POWERFUL CHEST",
    image: require("root/assets/chest.jpg"),
  },
  { title: "WIDE BACK", image: require("root/assets/back.jpg") },
  {
    title: "BIG SHOULDERS",
    image: require("root/assets/shoulders.jpg"),
  },
  { title: "STRONG LEGS", image: require("root/assets/legs.jpg") },
  {
    title: "WEIGHT LOSS",
    image: require("root/assets/weightloss.jpg"),
  },
  {
    title: "SCULPTED BODY",
    image: require("root/assets/sculpted.jpg"),
  },
  { title: "6 PACK ABS", image: require("root/assets/abs.jpg") },
  {
    title: "POWERLIFTING",
    image: require("root/assets/powerlifting.jpg"),
  },
  { title: "CROSSFIT", image: require("root/assets/crossfit.jpg") },
  {
    title: "FULL BODY IN 45 MINUTES",
    image: require("root/assets/fullbody.jpg"),
  },
];

export default function MaleWorkoutPlans() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#f8fafc" />
            </TouchableOpacity>
            <Text style={styles.title}>Select your workout plan</Text>
          </View>
          <Text style={styles.subtitle}>Grouped, Men</Text>
        </View>

        {/* Workout Plan Cards */}
        <View style={styles.cardsWrapper}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("PlanOverview", {
                  planId: 1,
                })
              }
            >
              <Image source={plan.image} style={styles.cardImage} />
              <View style={styles.overlay} />
              <Text style={styles.cardText}>{plan.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { label: "Home", icon: "home", screen: "Dashboard" },
          { label: "Workout", icon: "barbell", screen: "Workout" },
          {
            label: "Plans",
            icon: "fitness",
            screen: "MaleWorkoutPlans",
          },
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
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 50,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerRow: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    color: "#f8fafc",
    textAlign: "center",
    fontFamily: "poppins",
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: "500",
    fontFamily: "poppins",
  },
  cardsWrapper: {
    paddingHorizontal: 20,
  },
  card: {
    width: screenWidth - 40,
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
    height: 110,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  cardText: {
    position: "absolute",
    bottom: 12,
    left: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#f8fafc",
    fontFamily: "poppins",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#38bdf8",
    marginTop: 4,
    fontFamily: "poppins",
  },
});
