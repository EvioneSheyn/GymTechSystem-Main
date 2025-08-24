import Dashboard from "@/Pages/Main/Dashboard";
import Workout from "@/Pages/Main/Workouts";
import MaleWorkoutPlans from "@/Pages/Main/MaleWorkoutPlans";
import FemaleWorkoutPlans from "@/Pages/Main/FemaleWorkoutPlans";
import WorkoutDetails from "@/Pages/Main/WorkoutDetails";
import WorkoutDetailsFemale from "@/Pages/Main/WorkoutDetailsFemale";
import WorkoutExercisesScreen from "@/Pages/Main/WorkoutExercisesScreen";
import BeginWorkout from "@/Pages/Main/BeginWorkout";
import LargeArmsExercises from "@/Pages/Main/LargeArmsExercises";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this
import ExerciseInfo from "@/Pages/Main/ExerciseInfo";
import PlanOverview from "./PlanOverview";
import ProgressPage from "./ProgressPage";
import TrackMeal from "./TrackMeal";
import PlanRoutineOverview from "./PlanRoutineOverview";
import CalendarPage from "./Calendar";
import GoalPage from "./GoalPage";
import ReportPage from "./ReportPage";
import SettingsPage from "./SettingsPage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MealPage from "./MealPage";
import FoodPage from "./FoodPage";
const Stack = createNativeStackNavigator();
// const Tabs = createBottomTabNavigator(); //TODO refactor to tabs, too many stacks

export default function MainNavigator() {
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
