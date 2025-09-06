import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "@/Axios";
import { Image } from "expo-image";
import { ExerciseImages } from "../../../sample-data/Exercises";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const PlanRoutineOverview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { plan } = route.params;
  const [routines, setRoutines] = useState([]);
  const [levelIndex, setLevelIndex] = useState(0);

  const [workoutSessions, setWorkoutSessions] = useState();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await api.get("/api/plan-routines/" + plan.id);

        let routines = response.data.routines;

        routines.forEach((routine) => {
          routine.duration = 0;
          routine.sets.forEach((set) => {
            switch (set.unit) {
              case "secs":
                routine.duration += set.value * set.count;
                break;
              case "mins":
                routine.duration += set.value * 60 * set.count;
                break;
              case "reps":
                routine.duration += set.value * 3 * set.count;
                break;
            }
          });
          console.log(routine.duration);
        });
        setRoutines(routines);
      } catch (error) {
        console.error("Error fetching routines: ", error);
      }
    };

    fetchRoutines();
  }, []);

  useEffect(() => {
    const fetchWorkoutSessions = async () => {
      try {
        const response = await api.get("/api/all-workout-sessions");

        if (response.status === 200) {
          setWorkoutSessions(response.data.sessions);
        }
      } catch (error) {
        console.error("Error fetching workout sessions: ", error);
      }
    };

    fetchWorkoutSessions();
  }, []);

  useEffect(() => {
    getLevelIndex();
  }, [routines]);

  useEffect(() => {
    console.log("Level Index: ", levelIndex);
  }, [levelIndex]);

  const checkCompletion = (routineIdToCheck) => {
    return workoutSessions?.some((s) => s.routineId === routineIdToCheck);
  };

  const getMinuteFormat = (timeInSeconds) => {
    const minute = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    return `${minute}:${seconds.toString().padStart(2, "0")}`;
  };

  const getLevelIndex = () => {
    let lastRoutineId = routines[0]?.id;

    workoutSessions?.forEach((session, index) => {
      if (session.routineId > lastRoutineId) {
        lastRoutineId = session.routineId;
        console.log("Last Routine Id: ", session.routineId);
      }
    });

    routines?.forEach((routine, index) => {
      if (lastRoutineId == routine.id) {
        const nextIndex =
          index + 1 >= routines.length ? routines.length : index + 1;
        // Indicate if the current index is the last index

        console.log("Next Index: ", nextIndex);

        // Check if current level is completed
        if (checkCompletion(routines[levelIndex].id)) {
          if (routines[nextIndex]?.isRest) {
            setLevelIndex(nextIndex + 1);
          } else {
            setLevelIndex(nextIndex);
          }
        }
      }
    });
  };

  const handleStartRoutine = (routineId) => {
    navigation.navigate("WorkoutExercises", { routineId: routineId });
  };

  const getTitle = (rawTitle) => {
    return rawTitle.split("-")[1];
  };

  const getDay = (rawTitle) => {
    return rawTitle.split(" ")[1];
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.titleView}>
        <Text style={styles.header}>{plan.title}</Text>
      </View>
      <View
        style={{
          height: 200,
        }}
      >
        <Image
          source={ExerciseImages[plan.image]}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          top={0}
        />
      </View>

      <ScrollView style={styles.container}>
        {routines.map((routine, index) => (
          <View key={index}>
            <View
              style={[
                styles.routineView,
                routine.isRest && { backgroundColor: "#bfcedfb4" },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 14,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 14 }}>DAY</Text>
                  <Text style={styles.dayText}>{getDay(routine.title)}</Text>
                </View>
                <View style={{ flexGrow: 1 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {getTitle(routine.title)}
                  </Text>
                  {!routine.isRest && (
                    <View style={styles.timeView}>
                      <MaterialIcons name={"timer"} style={styles.timeIcon} />
                      <Text style={{ fontWeight: 500, fontSize: 12 }}>
                        {getMinuteFormat(routine.duration)}
                      </Text>
                    </View>
                  )}
                </View>
                <View>
                  {index === 0 ||
                  (checkCompletion(routines[index - 2]?.id) &&
                    !routine.isRest) ? (
                    <AnimatedCircularProgress
                      size={50}
                      width={3}
                      fill={checkCompletion(routine.id) ? 100 : 0}
                      tintColor="#00e0ff"
                      backgroundColor="#9b9b9bff"
                    >
                      {(fill) => (
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "rgba(160, 160, 160, 1)",
                            fontSize: 12,
                          }}
                        >
                          {Math.floor(fill)}%
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                  ) : !routine.isRest ? (
                    <MaterialIcons
                      name={"lock-outline"}
                      size={32}
                      color={"#bbb"}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: "https://www.svgrepo.com/show/529887/sleeping-circle.svg",
                      }}
                      height={45}
                      width={45}
                    />
                  )}
                </View>
              </View>
              {levelIndex === index && (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartRoutine(routine.id)}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Start
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        <View style={{ height: 250 }} />
      </ScrollView>
    </View>
  );
};

export default PlanRoutineOverview;

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    flexGrow: 1,
    backgroundColor: "#E1E6EF",
    paddingHorizontal: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  backButton: {
    margin: 16,
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 11,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 52,
    color: "white",
  },
  routineView: {
    marginTop: 15,
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderColor: "#919191ff",
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 14,
  },
  titleView: {
    position: "absolute",
    top: 52,
    left: 24,
    zIndex: 10,
  },
  dayText: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 24,
  },
  timeView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeIcon: {
    fontSize: 16,
    color: "rgba(121,121,121,0.73)",
  },
  startButton: {
    backgroundColor: "#6DD5C0",
    width: "100%",
    paddingVertical: 8,
    borderRadius: 12,
  },
});
