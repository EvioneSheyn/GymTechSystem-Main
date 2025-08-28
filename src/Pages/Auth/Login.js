import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/Axios";
import AuthLayout from "@/Layouts/AuthLayout";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    console.log("naay error");

    await api
      .post("/api/auth/login", {
        email,
        password,
      })
      .then((response) => {
        const data = response.data;
        AsyncStorage.setItem("jwtToken", data.token);
        AsyncStorage.setItem("user", JSON.stringify(data.user));

        navigation.navigate("MainNavigator", {
          screen: "Dashboard",
        });
      })
      .catch((error) => {
        if (error.response) {
          // Server responded with a status outside 2xx

          alert(error.response.data.message);
          console.log("API ERROR:", {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        } else if (error.request) {
          // Request was made but no response
          console.log("No response received:", error.request);
        } else {
          // Something else caused the error
          console.log("Error setting up request:", error.message);
        }
      });
  };

  return (
    <AuthLayout>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>L O G I N</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="email"
            size={24}
            color="#4e8cff"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { paddingLeft: 50 }]}
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            textContentType="emailAddress"
          />
        </View>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIconWrapper}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#4e8cff"
            />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { paddingLeft: 50 }]}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoComplete="password"
            textContentType="password"
          />
        </View>
        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
