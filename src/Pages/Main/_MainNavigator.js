import Dashboard from "@/Pages/Main/Dashboard";
import Workout from "@/Pages/Main/Workouts";
import MaleWorkoutPlans from "@/Pages/Main/MaleWorkoutPlans";
import FemaleWorkoutPlans from "@/Pages/Main/FemaleWorkoutPlans";
import WorkoutDetails from "@/Pages/Main/WorkoutDetails";
import WorkoutDetailsFemale from "@/Pages/Main/WorkoutDetailsFemale";
import WorkoutExercisesScreen from "@/Pages/Main/WorkoutExercisesScreen";
import BeginWorkout from "@/Pages/Routines/BeginWorkout";
import LargeArmsExercises from "@/Pages/Main/LargeArmsExercises";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this
import { useEffect } from "react";
import api from "@/Axios";
import { useNavigation } from "@react-navigation/native";
import ExerciseInfo from "@/Pages/Main/ExerciseInfo";
import PlanOverview from "./PlanOverview";
import PlanRoutineOverview from "./PlanRoutineOverview";
const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const navigation = useNavigation();
  useEffect(() => {
    //   api
    //     .get("/protected")
    //     .then((response) => {
    //       console.log("authenticated!");
    //     })
    //     .catch((error) => {
    //       navigation.navigate("AuthNavigator", { screen: "Login" });
    //       console.error(error);
    //     });
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Workout" component={Workout} />
      <Stack.Screen
        name="MaleWorkoutPlans"
        component={MaleWorkoutPlans}
      />
      <Stack.Screen
        name="FemaleWorkoutPlans"
        component={FemaleWorkoutPlans}
      />
      <Stack.Screen
        name="WorkoutDetails"
        component={WorkoutDetails}
      />
      <Stack.Screen
        name="WorkoutDetailsFemale"
        component={WorkoutDetailsFemale}
      />
      <Stack.Screen
        name="WorkoutExercises"
        component={WorkoutExercisesScreen}
      />
      <Stack.Screen
        name="LargeArmsExercises"
        component={LargeArmsExercises}
      />
      <Stack.Screen name="BeginWorkout" component={BeginWorkout} />
      <Stack.Screen name="ExerciseInfo" component={ExerciseInfo} />
      <Stack.Screen name="PlanOverview" component={PlanOverview} />
      <Stack.Screen
        name="PlanRoutineOverview"
        component={PlanRoutineOverview}
      />
    </Stack.Navigator>
  );
}
