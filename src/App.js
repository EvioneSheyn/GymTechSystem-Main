import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "@/Pages/Auth/_AuthNavigator";
import MainNavigator from "@/Pages/Main/_MainNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this
import ExerciseInfo from "@/Pages/Main/ExerciseInfo";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="ExerciseInfo" component={ExerciseInfo} /> */}
        <Stack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
        />
        <Stack.Screen
          name="MainNavigator"
          component={MainNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
