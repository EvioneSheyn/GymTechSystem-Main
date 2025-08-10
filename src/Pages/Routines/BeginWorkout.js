import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { FontAwesome5 } from "react-native-vector-icons";

const REST_DURATION = 5; // seconds
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
  const { exercises = [], onFinish } = route.params ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timer, setTimer] = useState(null);
  const [resting, setResting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [restNote, setRestNote] = useState("");

  const currentExercise = exercises[currentIdx];

  // Helper to get duration in seconds
  const getDurationSeconds = (exercise) => {
    if (!exercise || !exercise.duration) return 0;
    if (exercise.durationType === "minutes") {
      return exercise.duration * 60;
    }
    return exercise.duration; // assume seconds
  };

  const getRandomRestNotes = () => {
    let totalRestNotes = REST_NOTES.length;
    let random_index = Math.floor(Math.random() * totalRestNotes);

    return REST_NOTES[random_index];
  };

  useEffect(() => {
    if (!currentExercise) return;
    if (resting) {
      setRestNote(getRandomRestNotes());
      setTimer(REST_DURATION);
    } else if (currentExercise.type === "time") {
      setTimer(getDurationSeconds(currentExercise));
    } else {
      setTimer(null);
    }
  }, [currentIdx, resting]);

  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (timer === 0 && resting) {
      handleNext();
    }
  }, [timer, resting]);

  const handleDone = () => {
    if (currentExercise.type === "time" && timer > 0) return;
    setResting(true);
  };

  const handleNext = () => {
    if (currentIdx + 1 < exercises.length) {
      setCurrentIdx(currentIdx + 1);
      setResting(false);
    } else {
      setCompleted(true);
      if (onFinish) onFinish();
    }
  };

  if (completed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>
          You have completed all exercises.
        </Text>
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
      {resting ? (
        <>
          <Text style={styles.title}>Rest</Text>
          <Text style={styles.subtitle}>
            Next: {exercises[currentIdx + 1]?.name || "Finish"}
          </Text>
          <Text style={styles.restNote}>{restNote}</Text>
          <View style={styles.timerContainer}>
            <CountdownCircleTimer
              isPlaying
              duration={REST_DURATION}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[7, 5, 2, 0]}
              onComplete={handleNext}
            >
              {({ remainingTime }) => (
                <Text
                  style={{
                    fontSize: 56,
                  }}
                >
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
            {/* <Text style={styles.timerText}>{timer}s</Text> */}
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
              marginBottom: 24,
            }}
          >
            <Text style={styles.title}>{currentExercise.name}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ExerciseInfo");
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
            source={{
              uri:
                currentExercise.gif ??
                "https://mir-s3-cdn-cf.behance.net/project_modules/source/a258b2108677535.5fc364926e4a7.gif",
            }}
            style={styles.gif}
          />
          {currentExercise.type === "time" ? (
            <View style={styles.timerContainer}>
              <CountdownCircleTimer
                isPlaying
                duration={getDurationSeconds(currentExercise)}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[7, 5, 2, 0]}
              >
                {({ remainingTime }) => (
                  <Text
                    style={{
                      fontSize: 56,
                    }}
                  >
                    {remainingTime}
                  </Text>
                )}
              </CountdownCircleTimer>
            </View>
          ) : (
            <View style={styles.repsContainer}>
              <Text style={styles.repsText}>
                {currentExercise.reps} reps
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleDone}
            disabled={currentExercise.type === "time" && timer > 0}
          >
            <Text style={styles.nextButtonText}>
              {currentExercise.type === "time" && timer > 0
                ? "Wait..."
                : "Done"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default BeginWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
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
    backgroundColor: "#eee",
  },
  timerContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    minWidth: 100,
    alignItems: "center",
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
    backgroundColor: "#06b6d4",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 24,
    alignItems: "center",
    opacity: 1,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
