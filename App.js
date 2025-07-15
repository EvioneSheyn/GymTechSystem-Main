import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./Dashboard";
import Workout from "./Workouts";
import MaleWorkoutPlans from "./MaleWorkoutPlans";
import FemaleWorkoutPlans from "./FemaleWorkoutPlans";
import WorkoutDetails from "./WorkoutDetails";
import WorkoutDetailsFemale from "./WorkoutDetailsFemale";
import WorkoutExercisesScreen from "./WorkoutExercisesScreen"; // ✅ Added this
import Login from "./Login";
import Register from "./Register";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();
const backgroundImage = require("./assets/barbel.jpg");

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => setIsAuthenticated(true);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          setIsAuthenticated(false);
          setIsSignUp(false);
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.gradientShape} />
          <Text style={styles.welcomeTitle}>
            Welcome to <Text style={styles.wTitle}>GYMTECH</Text>
          </Text>
          {isSignUp ? (
            <Register
              onSwitch={() => setIsSignUp(false)}
              onAuth={handleAuth}
              auth={auth}
            />
          ) : (
            <Login
              onSwitch={() => setIsSignUp(true)}
              onAuth={handleAuth}
              auth={auth}
            />
          )}
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Dashboard"
          component={(props) => (
            <Dashboard {...props} logout={handleLogout} />
          )}
        />
        <Stack.Screen name="Workout" component={Workout} />
        <Stack.Screen name="MaleWorkoutPlans" component={MaleWorkoutPlans} />
        <Stack.Screen name="FemaleWorkoutPlans" component={FemaleWorkoutPlans} />
        <Stack.Screen name="WorkoutDetails" component={WorkoutDetails} />
        <Stack.Screen name="WorkoutDetailsFemale" component={WorkoutDetailsFemale} />
        <Stack.Screen name="WorkoutExercises" component={WorkoutExercisesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  gradientShape: {
    position: "absolute",
    top: -200,
    left: -150,
    width: 400,
    height: 400,
    backgroundColor: "#4e8cff",
    borderRadius: 200,
    transform: [{ rotate: "-25deg" }],
    opacity: 0.15,
    zIndex: 0,
  },
  welcomeTitle: {
    fontFamily: "poppins",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 40,
    color: "#131833",
    letterSpacing: 2,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wTitle: {
    fontFamily: "georgia",
  },
});
