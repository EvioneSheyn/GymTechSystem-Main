import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const MainNav = ({ navigation }) => {
  return (
    <View style={styles.bottomNav}>
      {[
        { label: "Home", icon: "home", screen: "Dashboard" },
        { label: "Meal", icon: "local-dining", screen: "TrackMeal" },
        { label: "Progress", icon: "timeline", screen: "Progress" },
        { label: "Report", icon: "equalizer", screen: "Report" },
        { label: "Settings", icon: "settings", screen: "Settings" },
      ].map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => {
            navigation.navigate(btn.screen);
          }}
        >
          <MaterialIcons name={btn.icon} size={24} color="#38bdf8" />
          <Text style={styles.navText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MainNav;

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#38bdf8",
    marginTop: 4,
    fontFamily: "poppins",
  },
});
