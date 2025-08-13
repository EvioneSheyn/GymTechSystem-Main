import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack"; // ✅ Added this
import { useEffect } from "react";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let jwtToken = await AsyncStorage.getItem("jwtToken");
        if (jwtToken)
          navigation.navigate("MainNavigator", {
            screen: "Dashboard",
          });
      } catch (error) {
        console.error("Guard Error: ", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
