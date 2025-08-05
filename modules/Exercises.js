const Exercises = [
  {
    name: "Treadmill",
    type: "time",
    duration: 20,
    durationType: 'seconds',
    reps: 1,
    sets: 1,
    details: "5 min., 110-140bpm",
    image: require("../assets/exercises/treadmill.jpg"),
  },
  {
    name: "Arm circles back",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 20,
    sets: 1,
    details: "1x20",
    image: require("../assets/arm_circles_back.jpg"),
  },
  {
    name: "Arm circles forward",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 20,
    sets: 1,
    details: "1x20",
    image: require("../assets/arm_circles_forward.jpg"),
  },
  {
    name: "Hanging side leg raise",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 20,
    sets: 4,
    details: "4x20",
    image: require("../assets/leg_raise.jpg"),
  },
  {
    name: "Seated pec fly",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 12,
    sets: 4,
    weight: 20,
    details: "4x12x20 kg",
    image: require("../assets/pec_fly.jpg"),
  },
  {
    name: "Flat bench dumbbell chest press",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 10,
    sets: 4,
    weight: 10,
    details: "4x10x10 kg",
    image: require("../assets/dumbbell_press.jpg"),
  },
  {
    name: "Machine incline chest press",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 12,
    sets: 4,
    weight: 20,
    details: "4x12x20 kg",
    image: require("../assets/incline_press.jpg"),
  },
  {
    name: "Chest to floor push-ups",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 12,
    sets: 4,
    details: "4x12",
    image: require("../assets/pushups.jpg"),
  },
  {
    name: "High-pulley curl",
    type: "reps",
    duration: 0,
    durationType: "seconds",
    reps: 12,
    sets: 4,
    weight: 15,
    details: "4x12x15 kg",
    image: require("../assets/pulley_curl.jpg"),
  },
  {
    name: "Elliptical trainer",
    type: "time",
    duration: 5,
    durationType: "minutes",
    reps: 1,
    sets: 1,
    details: "5 min., 110-140bpm",
    image: require("../assets/elliptical.jpg"),
  },
  {
    name: "Chest muscles stretch",
    type: "time",
    duration: 20,
    durationType: "seconds",
    reps: 1,
    sets: 1,
    details: "1x20 s",
    image: require("../assets/chest_stretch.jpg"),
  },
  {
    name: "Hand and shoulder extensor stretch",
    type: "time",
    duration: 20,
    durationType: "seconds",
    reps: 1,
    sets: 1,
    details: "1x20 s",
    image: require("../assets/shoulder_stretch.jpg"),
  },
];

const ExercisesWithID = [
  ...Exercises.map((exercise, index) => ({
    id: index + 1,
    ...exercise,
  })),
];

const getExerciseById = (id) => {
  let exercise = ExercisesWithID[id];
};

const getExerciseByName = (name) => {
  return ExercisesWithID.find((exercise) => exercise.name === name);
};

export { Exercises, ExercisesWithID };
