import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

const REST_DURATION = 5; // seconds

const BeginWorkout = ({ route, navigation }) => {
  const { exercises = [], onFinish } = route.params ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timer, setTimer] = useState(null);
  const [resting, setResting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentExercise = exercises[currentIdx];

  // Helper to get duration in seconds
  const getDurationSeconds = (exercise) => {
    if (!exercise || !exercise.duration) return 0;
    if (exercise.durationType === "minutes") {
      return exercise.duration * 60;
    }
    return exercise.duration; // assume seconds
  };

  useEffect(() => {
    if (!currentExercise) return;
    if (resting) {
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
          <Text style={styles.title}>{currentExercise.name}</Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
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
  repsContainer: {
    backgroundColor: "#f5f5f5",
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
