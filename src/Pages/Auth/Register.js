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
import { api } from "@/Axios";
import { useNavigation } from "@react-navigation/native";
import AuthLayout from "@/Layouts/AuthLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    await api
      .post("/api/auth/register", {
        username,
        email,
        password,
      })
      .then((response) => {
        console.log("Successfully created the account!");
        const data = response.data;
        AsyncStorage.setItem("jwtToken", data.token);
        AsyncStorage.setItem("user", JSON.stringify(data.user));
        navigation.navigate("MainNavigator", {
          screen: "Dashboard",
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  return (
    <AuthLayout>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color="#4e8cff"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { paddingLeft: 50 }]}
            placeholder="Username"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            autoComplete="username"
            textContentType="username"
          />
        </View>
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
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIconWrapper}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showConfirmPassword ? "visibility" : "visibility-off"}
              size={24}
              color="#4e8cff"
            />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { paddingLeft: 50 }]}
            placeholder="Confirm Password"
            placeholderTextColor="#ccc"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoComplete="password"
            textContentType="password"
          />
        </View>
        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleText}>Already have an account? Login</Text>
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
