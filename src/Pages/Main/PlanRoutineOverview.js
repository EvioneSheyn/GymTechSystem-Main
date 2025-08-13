import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "@/Axios";

const PlanRoutineOverview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { planId } = route.params;
  const [routines, setRoutines] = useState([]);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await api.get(
          "/api/plan-routines/" + planId
        );

        let routines = response.data.routines;
        setRoutines(routines);
      } catch (error) {
        console.error("Error fetching routines: ", error);
      }
    };

    fetchRoutines();
  }, []);

  const handleStartRoutine = (planId) => {
    navigation.navigate("WorkoutExercises", { routineId: planId });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Large Arms</Text>

      {routines.map((routine, index) =>
        routine.isRest ? (
          <View key={index}>
            <View
              style={{
                marginTop: 15,
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#dadadaff",
                paddingHorizontal: 24,
                paddingVertical: 24,
                backgroundColor: "#e9e9e9ff",
                borderRadius: 14,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  color: "gray",
                }}
              >
                {routine.title}
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            key={index}
            onPress={() => {
              handleStartRoutine(routine.id);
            }}
          >
            <View style={styles.routineView}>
              <Text style={{ fontWeight: "bold" }}>
                {routine.title}
              </Text>
            </View>
          </TouchableOpacity>
        )
      )}
    </ScrollView>
  );
};

export default PlanRoutineOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
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
    marginTop: 52,
  },
  routineView: {
    marginTop: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#919191ff",
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 14,
  },
});
