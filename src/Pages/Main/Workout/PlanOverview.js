import React, { useState, useEffect } from "react";
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
import { api } from "@/Axios";

export default function PlanOverview() {
  const navigation = useNavigation();
  const route = useRoute();
  const { planId } = route.params;
  const [plan, setPlan] = useState({});
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get(`api/plans/${planId}`);

        let plan = response.data.plan;
        setPlan(plan);

        let details = JSON.parse(plan.details)
          .map((item) => `- ${item}`)
          .join("\n");
        setDetails(details);
      } catch (error) {
        console.error("Error retrieivng plan: ", error.response.data.message);
      }
    };

    fetchPlan();
  }, []);

  const handleStartWorkout = () => {
    navigation.navigate("PlanRoutineOverview", { plan: plan });
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

      <Image 
        source={{ uri: plan.image }} 
        style={styles.image}
        contentFit="cover"
        placeholder="🏋️"
        transition={200}
      />
      <View style={styles.textOverlay}>
        <Text style={styles.planTitle}>{plan.title}</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.details}>{details}</Text>

        <TouchableOpacity style={styles.addButton} onPress={handleStartWorkout}>
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
