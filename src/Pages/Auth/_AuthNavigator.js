import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";

import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
