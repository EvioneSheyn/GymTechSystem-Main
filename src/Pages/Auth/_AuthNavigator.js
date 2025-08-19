import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EntryGuard from "@/Guards/EntryGuard";

const Stack = createNativeStackNavigator();

const routes = [
  {
    name: "Login",
    component: <Login />,
  },
  {
    name: "Register",
    component: <Register />,
  },
];

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {routes.map((route, index) => (
        <Stack.Screen key={index} name={route.name}>
          {() => <EntryGuard component={route.component} />}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}
