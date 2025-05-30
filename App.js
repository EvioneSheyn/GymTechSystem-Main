import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { auth } from './firebase';
import { Alert } from "react-native";

const backgroundImage = require("./assets/barbel.jpg");

export default function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = (email, password) => {
    setIsAuthenticated(true); // On successful registration
  };

  if (isAuthenticated) {
    const handleLogout = () => {
      Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => {
          setIsAuthenticated(false);
          setIsSignUp(false);
        }
        }
      ],
      { cancelable: true }
      );
    };

    return <Dashboard logout={handleLogout} />;
  }

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
          Welcome to
          <Text style={styles.wTitle}> GYMTECH</Text>
        </Text>
        {isSignUp ? (
          <Register onSwitch={() => setIsSignUp(false)} onAuth={handleAuth} auth={auth} />
        ) : (
          <Login onSwitch={() => setIsSignUp(true)} onAuth={handleAuth} auth={auth} />
        )}
      </ImageBackground>
    </KeyboardAvoidingView>
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

    // Highlight styles
    backgroundColor: "rgba(255, 255, 255, 0.6)", // translucent white
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,

    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wTitle: {
    fontFamily: "georgia",
  },
  innerContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 28,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 15,
    zIndex: 1,
  },
  title: {
    fontFamily: "georgia",
    fontSize: 33,
    fontWeight: "700",
    marginBottom: 28,
    textAlign: "center",
    color: "white",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 28,
  },
  inputIcon: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  eyeIconWrapper: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -12 }],
    zIndex: 2,
  },
  input: {
    height: 52,
    borderColor: "#bbb",
    borderWidth: 1.8,
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: "#131833",
    color: "white",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#4e8cff",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
    shadowColor: "#3b74f2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    backgroundColor: "#3b74f2",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  toggleText: {
    color: "#1015b3",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
