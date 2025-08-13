import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "@/Pages/Auth/_AuthNavigator";
import MainNavigator from "@/Pages/Main/_MainNavigator";
import DevNavigator from "@/Pages/_Dev/_DevNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Dev" component={DevNavigator} /> */}
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
