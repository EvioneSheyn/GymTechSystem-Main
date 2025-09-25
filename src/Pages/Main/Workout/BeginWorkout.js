import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { ExerciseImages } from "root/sample-data/Exercises";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/Axios";

const REST_NOTES = [
  "Rest helps your muscles recover and grow stronger.",
  "Short breaks prevent injury by reducing strain on joints and ligaments.",
  "Rest restores energy so you can push harder in the next set.",
  "Taking a breather helps regulate your breathing and heart rate.",
  "Recovery time allows your nervous system to reset for better coordination.",
  "Proper rest improves workout performance and endurance.",
  "Rest gives your body time to flush out lactic acid and reduce soreness.",
  "Short pauses keep your form sharp and movements controlled.",
  "Resting helps your body adapt to training, making you fitter over time.",
  "Breaks give your mind a moment to focus and stay motivated.",
];

const BeginWorkout = ({ route, navigation }) => {
  const { exercises = [], routineId } = route.params ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDone, setDone] = useState(true);
  const [resting, setResting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [restNote, setRestNote] = useState("");
  const [startTime] = useState(Date.now());
  const [timer, setTimer] = useState("0:00");
  const [profile, setProfile] = useState();
  const [SetCount, setSetCount] = useState(0);
  const [initialStart, setInitialStart] = useState(false);
  const [status, setStatus] = useState();
  const [duration, setDuration] = useState(1);
  const [variantUnitValue, setVariantUnitValue] = useState();

  const currentExercise = exercises[currentIdx];

  const getRandomRestNotes = () => {
    let totalRestNotes = REST_NOTES.length;
    let random_index = Math.floor(Math.random() * totalRestNotes);

    return REST_NOTES[random_index];
  };

  useEffect(() => {
    console.log("variantUnit: ", currentExercise.exercise.variantUnit);

    const fetchProfile = async () => {
      const storedProfile = await AsyncStorage.getItem("profile");

      setProfile(JSON.parse(storedProfile));
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!initialStart) return;
    const generalDuration = getDuration();
    setDuration(generalDuration);

    if (status === "working") {
      setResting(false);
      setDone(true); // secures that manual are not automatically starts the resting time
    } else if (status === "resting") {
      incrementSet();

      setDuration(generalDuration);
      setResting(true);
      setDone(false);
    }

    if (currentExercise.exercise.type === "time") {
      setDone(false);
    }
  }, [status]);

  useEffect(() => {
    console.log("Unit: ", currentExercise.unit);
    if (SetCount >= currentExercise.count) {
      setDone(true);
      setTimeout(() => {
        resetSet();
        handleNext();
        setDone(false);
      }, 1000);
    }
  }, [SetCount]);

  useEffect(() => {
    //NOTE timer
    setTimeout(() => {
      setTimer(getElapsedTime().formatted);
    }, 1000);
  }, [timer]);

  const handleDone = () => {
    if (
      (currentExercise.exercise.variantUnit === "kg" && !variantUnitValue) ||
      variantUnitValue <= 0
    ) {
      alert("Invalid input, change to appropriate weights");

      return;
    }
    setStatus("resting");
  };

  const incrementSet = () => {
    setSetCount((prev) => prev + 1);
  };

  const resetSet = () => {
    setSetCount(0);
  };

  const handleNext = () => {
    if (currentIdx + 1 < exercises.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
      handleOnFinish();
    }
  };

  const handleQuitting = () => {
    Alert.alert("Leaving", "Do you really wish to quit?", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", onPress: () => navigation.goBack() },
    ]);
  };

  const getMinuteFormat = (time) => {
    if (time < 60) return `${time}`;

    const minute = Math.floor(time / 60);
    const seconds = `${time % 60}`.padStart(2, "0");
    return `${minute}:${seconds}`;
  };

  const getElapsedTime = () => {
    const now = Date.now();
    const elapsedSeconds = Math.ceil((now - startTime) / 1000); // in seconds

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = `${elapsedSeconds % 60}`.padStart(2, "0");

    return {
      raw: elapsedSeconds,
      formatted: `${minutes}:${seconds}`,
    };
  };

  const getDuration = () => {
    const REST_DURATION = 5;

    if (currentExercise.unit === "mins") {
      // return currentExercise.value * 60;
      return 10;
    } else if (currentExercise.unit === "secs") {
      return currentExercise.value;
    } else {
      return REST_DURATION;
    }
  };

  const calculateCaloriesBurned = () => {
    const MET = 4; //TODO fixed for now but can vary
    // TODO separate MET for resting and actively working out.
    const durationHour = getElapsedTime().raw / 3600;
    return (MET * profile.weight * durationHour).toFixed(2);
  };

  const handleOnFinish = async () => {
    const caloriesBurned = calculateCaloriesBurned();

    console.log(caloriesBurned);
    try {
      const response = await api.post("/api/workout/finish-exercise", {
        routineId: routineId,
        caloriesBurned: caloriesBurned,
        duration: getElapsedTime().raw,
      });

      if (response.status === 200) {
        alert("Congratulations, You have finished the routine!");
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      console.log("Error recording workout: ", error.response.data.message);
    }
  };

  if (completed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>You have completed all exercises.</Text>
      </View>
    );
  }

  if (!currentExercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No exercises found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          position: "absolute",
          left: 30,
          top: 50,
        }}
      >
        <TouchableOpacity onPress={handleQuitting}>
          <FontAwesome5
            name="arrow-left"
            style={{
              fontSize: 24,
            }}
          />
        </TouchableOpacity>
        <Text>{timer}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
          marginBottom: 24,
        }}
      >
        <View>
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.title}
          >
            {currentIdx + 1} / {exercises.length} -{" "}
            {JSON.parse(currentExercise.exercise.target)[0]}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ExerciseInfo", {
              exercise: currentExercise.exercise,
            });
          }}
        >
          <FontAwesome5
            name="question-circle"
            iconType="solid"
            style={{
              fontSize: 22,
              color: "gray",
            }}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={ExerciseImages[currentExercise.exercise.image]}
        style={styles.gif}
      />
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          {currentExercise.exercise.name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 45,
          width: "100%",
          marginBottom: 24,
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.greenCircle}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>
              {currentExercise.value > 1 && currentExercise.unit === "reps"
                ? currentExercise.value
                : "No"}
            </Text>
          </View>
          <Text>Repeats required</Text>
        </View>
        <View style={[styles.centeredView]}>
          <CountdownCircleTimer
            key={`${currentIdx}-${duration}-${SetCount}-${status}`}
            isPlaying={!isDone}
            duration={duration}
            colors={"#61B1C3"}
            onComplete={() => {
              if (status === "resting") {
                setStatus("working");
              } else {
                setStatus("resting");
              }
            }}
            size={120}
            strokeWidth={6}
          >
            {({ remainingTime }) =>
              !initialStart ? (
                <TouchableOpacity
                  style={styles.centeredView}
                  onPress={() => {
                    setInitialStart(true);
                    setStatus("working");
                  }}
                >
                  <Text style={styles.initialStartText}>START</Text>
                  <MaterialIcons
                    name={"play-arrow"}
                    style={{
                      color: "#61B1C3",
                      fontSize: 52,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <Text
                  style={{
                    fontSize: 24,
                  }}
                >
                  {getMinuteFormat(remainingTime)}
                </Text>
              )
            }
          </CountdownCircleTimer>
          <Text>
            {currentExercise.exercise.type === "time" && status === "working"
              ? "Timer"
              : "Rest"}
          </Text>
        </View>
        <View style={styles.centeredView}>
          <View style={styles.orangeCircle}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>
              {SetCount}/{currentExercise.count}
            </Text>
          </View>
          <Text>Sets done</Text>
        </View>
      </View>
      {currentExercise.unit === "reps" &&
        initialStart &&
        isDone &&
        !resting && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            {currentExercise.exercise.variantUnit === "kg" && (
              <View style={styles.variableInput}>
                <TextInput
                  defaultValue={Math.floor(profile.weight * 0.1)}
                  value={variantUnitValue}
                  keyboardType="numeric"
                  placeholder="Enter KG"
                  style={{
                    width: "100%",
                    paddingHorizontal: 12,
                  }}
                  onChangeText={(text) => setVariantUnitValue(Number(text))}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleDone}
              disabled={currentExercise.exercise.type === "time" && !isDone}
            >
              <Text style={styles.nextButtonText}>Record</Text>
              <MaterialIcons
                name={"add-circle-outline"}
                style={{ color: "white", fontSize: 24 }}
              />
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
};

export default BeginWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 70,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 16,
    color: "#666",
  },
  gif: {
    width: 250,
    height: 250,
    borderRadius: 16,
    marginBottom: 32,
    objectFit: "contain",
  },
  timerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#e67e22",
  },
  restNote: {
    fontSize: 14,
    color: "gray",
    fontWeight: "bold",
    textAlign: "center",
    opacity: 0.5,
    marginBottom: 25,
  },
  repsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    minWidth: 100,
    alignItems: "center",
  },
  repsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3498db",
  },
  nextButton: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    backgroundColor: "#7FDFDF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    opacity: 1,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
  },
  orangeCircle: {
    borderRadius: 99999,
    borderWidth: 5,
    borderColor: "#E8BB7D",
    height: 65,
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  greenCircle: {
    borderRadius: 99999,
    borderWidth: 5,
    borderColor: "#61C399",
    height: 65,
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  initialStartText: {
    color: "#61B1C3",
    fontWeight: "bold",
    fontSize: 14,
  },
  variableInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
});
