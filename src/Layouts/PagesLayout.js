import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const PagesLayout = ({ children }) => {
  const navigation = useNavigation();

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#38bdf8" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {children}
      </ScrollView>
      <View style={styles.bottomNav}>
        {[
          { label: "Home", icon: "home", screen: "Dashboard" },
          { label: "Features", icon: "star", screen: "Features" },
          { label: "Pages", icon: "file-copy", screen: "Pages" },
          { label: "Search", icon: "search", screen: "Search" },
          { label: "Settings", icon: "settings", screen: "Settings" },
        ].map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => {
              if (btn.screen !== "Dashboard")
                navigation.navigate(btn.screen);
            }}
          >
            <MaterialIcons
              name={btn.icon}
              size={24}
              color="#38bdf8"
            />
            <Text style={styles.navText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default PagesLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#38bdf8",
    marginLeft: 8,
    fontFamily: "poppins",
  },
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
