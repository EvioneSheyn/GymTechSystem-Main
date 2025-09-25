import { StyleSheet } from "react-native";

import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/Axios";

const EntryGuard = ({ component }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let jwtToken = await AsyncStorage.getItem("jwtToken");

        if (jwtToken) {
          const response = await api.post("/validate", {
            token: jwtToken,
          });

          if (response.status === 200) {
            console.log("User is authenticated:", response.data);
            console.log(response.data);
            navigation.navigate("MainNavigator", {
              screen: "Dashboard",
            });
          }
        }
      } catch (error) {
        console.log("Guard Error: ", error.response.data);
      }
    };

    checkAuth();
  }, []);

  return <>{component}</>;
};

export default EntryGuard;

const styles = StyleSheet.create({});
