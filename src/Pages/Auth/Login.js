import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/Axios";
import AuthLayout from "@/Layouts/AuthLayout";
import { useNavigation } from "@react-navigation/native";
import ErrorHandler from "@/Components/ErrorHandler";
import FormField from "@/Components/FormField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });
      
      const data = response.data;
      console.log("Auth data: ", data);
      await AsyncStorage.setItem("jwtToken", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      navigation.navigate("MainNavigator", {
        screen: "Dashboard",
      });
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
        console.log("API ERROR:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        setErrorMessage("Network error. Please check your connection.");
        console.log("No response received:", error.request);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
        console.log("Error setting up request:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <ErrorHandler 
        error={errorMessage} 
        onDismiss={() => setErrorMessage("")}
        type="error"
      />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>L O G I N</Text>
        
        <FormField label="Email" error={errors.email} required>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="email"
              size={24}
              color="#4e8cff"
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input, 
                { paddingLeft: 50 },
                errors.email && styles.inputError
              ]}
              placeholder="Email"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: "" }));
                }
              }}
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>
        </FormField>

        <FormField label="Password" error={errors.password} required>
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
              style={[
                styles.input, 
                { paddingLeft: 50 },
                errors.password && styles.inputError
              ]}
              placeholder="Password"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: "" }));
                }
              }}
              autoComplete="password"
              textContentType="password"
            />
          </View>
        </FormField>

        <Pressable
          onPress={handleLogin}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </Pressable>
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleText}>Don't have an account? Sign Up</Text>
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
    marginBottom: 16,
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
  buttonDisabled: {
    backgroundColor: "#6b7280",
    opacity: 0.6,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
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
