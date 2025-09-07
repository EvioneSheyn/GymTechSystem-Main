import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default function AuthLayout({ children, modal, showModal = false }) {
  const backgroundImage = require("root/assets/barbel.jpg");

  return (
    // <KeyboardAwareScrollView
    //   style={{ flex: 1 }}
    //   contentContainerStyle={{
    //     flexGrow: 1,
    //     justifyContent: "flex-end",
    //   }}
    //   enableOnAndroid={true}
    //   extraScrollHeight={20} // space above keyboard
    // >
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.gradientShape} />
        <Text style={styles.welcomeTitle}>
          Welcome to <Text style={styles.wTitle}>GYMTECH</Text>
        </Text>
        {children}
      </ImageBackground>
      {showModal && modal}
    </View>
    // </KeyboardAwareScrollView>
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
