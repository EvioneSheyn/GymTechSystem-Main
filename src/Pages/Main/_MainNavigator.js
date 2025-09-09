import Dashboard from "@/Pages/Main/Dashboard";
import MaleWorkoutPlans from "@/Pages/Main/Workout/MaleWorkoutPlans";
import WorkoutExercisesScreen from "@/Pages/Main/Workout/WorkoutExercisesScreen";
import BeginWorkout from "@/Pages/Main/Workout/BeginWorkout";
import ExerciseInfo from "@/Pages/Main/Workout/ExerciseInfo";
import PlanOverview from "./Workout/PlanOverview";
import PlanRoutineOverview from "./Workout/PlanRoutineOverview"; 
import ProgressPage from "./ProgressPage";
import TrackMeal from "./TrackMeal";
import CalendarPage from "./Calendar";
import GoalPage from "./GoalPage";
import ReportPage from "./ReportPage";
import SettingsPage from "./SettingsPage";
import MealPage from "./MealPage";
import FoodPage from "./FoodPage";

import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Stack = createNativeStackNavigator();
// const Tabs = createBottomTabNavigator(); //TODO refactor to tabs, too many stacks

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="MaleWorkoutPlans" component={MaleWorkoutPlans} />
      <Stack.Screen
        name="WorkoutExercises"
        component={WorkoutExercisesScreen}
      />
      <Stack.Screen name="BeginWorkout" component={BeginWorkout} />
      <Stack.Screen name="ExerciseInfo" component={ExerciseInfo} />
      <Stack.Screen name="PlanOverview" component={PlanOverview} />
      <Stack.Screen
        name="PlanRoutineOverview"
        component={PlanRoutineOverview}
      />

      <Stack.Screen name="Meal" component={MealPage} />
      <Stack.Screen name="Food" component={FoodPage} />

      <Stack.Screen name="Calendar" component={CalendarPage} />
      <Stack.Screen name="Progress" component={ProgressPage} />
      <Stack.Screen name="TrackMeal" component={TrackMeal} />
      <Stack.Screen name="Goal" component={GoalPage} />
      <Stack.Screen name="Report" component={ReportPage} />
      <Stack.Screen name="Settings" component={SettingsPage} />
    </Stack.Navigator>
  );
}
