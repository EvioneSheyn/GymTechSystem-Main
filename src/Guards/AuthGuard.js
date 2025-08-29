import { StyleSheet, View } from "react-native";

import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/Axios";
import { CommonActions } from "@react-navigation/native";

const AuthGuard = ({ children }) => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log("nigana diri");

    const checkAuth = async () => {
      try {
        let jwtToken = await AsyncStorage.getItem("jwtToken");

        if (jwtToken) {
          const response = await api.post("/validate", {
            token: jwtToken,
          });

          if (response.status === 200) {
            console.log("User is authenticated:", response.data);
            return;
          }
        }

        // Redirect to Login Page
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "AuthNavigator",
                state: {
                  routes: [{ name: "Login" }],
                },
              },
            ],
          })
        );
      } catch (error) {
        console.log("Guard Error: ", error.response.data);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "AuthNavigator",
                state: {
                  routes: [{ name: "Login" }],
                },
              },
            ],
          })
        );
      }
    };

    checkAuth();
  }, []);

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default AuthGuard;

const styles = StyleSheet.create({});
