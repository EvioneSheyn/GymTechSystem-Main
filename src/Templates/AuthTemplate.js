import React, { useState } from "react";
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function AuthTemplate() {
  const [isSignUp, setIsSignUp] = useState(false);
  const backgroundImage = require("root/assets/barbel.jpg");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({
        ios: "padding",
        android: undefined,
      })}
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
          <Register onSwitch={() => setIsSignUp(false)} />
        ) : (
          <Login onSwitch={() => setIsSignUp(true)} />
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
