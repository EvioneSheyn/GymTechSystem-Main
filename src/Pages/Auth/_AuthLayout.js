import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function AuthLayout() {
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
    </Stack.Navigator>
  </NavigationContainer>;
}
