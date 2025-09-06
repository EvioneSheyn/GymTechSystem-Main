import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/Axios";
import Profile from "@/Components/Profile";
import MainNav from "@/Components/MainNav";
import { CommonActions } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import * as IntentLauncher from "expo-intent-launcher";
import * as WebBrowser from "expo-web-browser";

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + i);
  return {
    key: date.getDate() - date.getDay() + i,
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate().toString().padStart(2, "0"),
  };
});

const waverSource = require("root/assets/resources/CTU-DANAO-FITNESS-GYM-WAIVER.png");
const waverFile = require("root/assets/resources/CTU-DANAO-FITNESS-GYM-WAIVER.pdf");

const quickActions = [
  {
    label: "Workouts",
    icon: "play-circle",
    color: "#3B82F6",
    screen: "MaleWorkoutPlans",
  },
  {
    label: "Track Meal",
    icon: "restaurant",
    color: "#F97316",
    screen: "TrackMeal",
  },
  {
    label: "Progress",
    icon: "bar-chart",
    color: "#10B981",
    screen: "Progress",
  },
  {
    label: "Goals",
    icon: "target",
    color: "#8B5CF6",
    screen: "Goal",
  },
];

const todaysWorkouts = [
  {
    id: "1",
    name: "Chest & Triceps",
    time: "08:00 AM",
    icon: "dumbbell",
  },
  { id: "2", name: "HIIT Cardio", time: "10:00 AM", icon: "running" },
  { id: "3", name: "Yoga", time: "06:00 PM", icon: "spa" },
];

export default function Dashboard() {
  const navigation = useNavigation();
  const todayKey = new Date();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
        }
        const isVerified = await AsyncStorage.getItem("isVerified");
        if (isVerified) setVerifiedUser(true);
      } catch (error) {
        console.error("Failed to load user", error.message);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const isVerified = await AsyncStorage.getItem("isVerified");
        if (isVerified) return;

        const response = await api.get("/api/verification-update");
        const authenticated = response.data.authenticated;

        if (authenticated) {
          console.log("Authenticated");
          setVerifiedUser(true);
          await AsyncStorage.setItem("isVerified", authenticated);
        } else {
          console.log("Not Yet Authenticated");
          // setVerifiedUser(false);
        }
      } catch (error) {
        console.log(
          "Error on authentication update:",
          error.response.data.error
        );
      }
    };

    fetchVerificationStatus();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/api/profile");

        if (response.status === 200) {
          let profile = response.data.profile.dataValues;

          await AsyncStorage.setItem("profile", JSON.stringify(profile));
          setProfile(profile);
          setShowProfileForm(false);
        }
      } catch (error) {
        console.log("Failed to fetch profile", error.response.data.message);
        setProfile(null);
        setShowProfileForm(true);
      }
    };

    getProfile();
  }, []);

  useEffect(() => {
    console.log("Profile: ", profile);
  }, [profile]);

  const handleLogout = async () => {
    await AsyncStorage.clear();

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
  };

  if (!verifiedUser) {
    return <WaverForm />;
  }

  if (showProfileForm) {
    return <Profile setProfile={setProfile} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.greet}>Welcome back</Text>
            <Text style={styles.name}>{user?.username}</Text>
          </View>
          <View style={styles.headerRight}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2922/2922561.png",
              }} // TODO temporary, add profile soon
              style={styles.avatar}
            />
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <MaterialIcons name="logout" size={24} color="#F87171" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Calendar")}>
            <Text style={{ color: "white", fontSize: 12 }}>View Calendar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}
        >
          {days.map((item) => {
            const isToday = item.key === todayKey.getDate();
            return (
              <View
                key={item.key}
                style={[styles.dateItem, isToday && styles.dateItemSelected]}
              >
                <Text
                  style={[styles.dateText, isToday && styles.dateTextSelected]}
                >
                  {item.date}
                </Text>
                <Text
                  style={[styles.dayText, isToday && styles.dayTextSelected]}
                >
                  {item.day}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Shortcuts</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActions}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => {
                navigation.navigate(action.screen);
              }}
              style={[styles.actionCard, { borderColor: action.color + "AA" }]}
            >
              <Ionicons name={action.icon} size={28} color={action.color} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Today</Text>
        <FlatList
          data={todaysWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.workoutCard}>
              <FontAwesome5
                name={item.icon}
                size={24}
                color="#38bdf8"
                style={{ marginRight: 16 }}
              />
              <View>
                <Text style={styles.workoutName}>{item.name}</Text>
                <Text style={styles.workoutTime}>{item.time}</Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      </ScrollView>

      <MainNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greet: {
    fontSize: 16,
    color: "#94a3b8",
    fontFamily: "poppins",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f1f5f9",
    fontFamily: "georgia",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#38bdf8",
  },
  logoutBtn: {
    marginLeft: 12,
    backgroundColor: "#f8717122",
    padding: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 12,
    marginTop: 10,
    fontFamily: "poppins",
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dateItem: {
    width: 38,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  dateItemSelected: {
    backgroundColor: "#38bdf8",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f1f5f9",
  },
  dateTextSelected: {
    color: "#0f172a",
  },
  dayText: {
    fontSize: 10,
    color: "#94a3b8",
  },
  dayTextSelected: {
    color: "#0f172a",
  },
  quickActions: {
    marginBottom: 28,
  },
  actionCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 18,
    marginRight: 16,
    minWidth: 110,
    backgroundColor: "#1e293b",
    borderWidth: 1.5,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#f1f5f9",
    fontFamily: "poppins",
    textAlign: "center",
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
  },
  workoutName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#f1f5f9",
    fontFamily: "poppins",
  },
  workoutTime: {
    fontSize: 14,
    color: "#38bdf8",
    fontFamily: "poppins",
  },
  bottomNav: {
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
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const WaverForm = () => {
  const downloadFile = async () => {
    const fileUri =
      "https://drive.google.com/file/d/1fFQbfmxymxBEnh85mFgw__aWFAGW1aeF/view?usp=sharing";
    try {
      await WebBrowser.openBrowserAsync(fileUri);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9FAFB", // light background
        paddingVertical: 32,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          paddingBottom: 56,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {/* Heading */}
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#2563EB", // blue
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Thank you for registering!
        </Text>

        <Text
          style={{
            fontWeight: "500",
            fontSize: 14,
            color: "gray",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          You are one step closer to creating your account with us.
        </Text>

        {/* Instructions */}
        <Text
          style={{
            fontSize: 16,
            marginBottom: 8,
            color: "#374151",
          }}
        >
          The next step is to{" "}
          <Text style={{ fontWeight: "bold", color: "#F97316" }}>
            verify your account
          </Text>
        </Text>

        <Text style={{ fontSize: 15, marginBottom: 6, color: "#374151" }}>
          Follow the steps below:
        </Text>

        <Text style={{ fontSize: 14, marginBottom: 4, color: "#374151" }}>
          • Get a copy of the CTU Danao Fitness Gym Waver below by pressing the
          image
        </Text>

        {/* Image Button */}
        <TouchableOpacity
          style={{
            marginVertical: 16,
            borderWidth: 2,
            borderColor: "#22C55E", // green border
            borderRadius: 12,
            overflow: "hidden",
          }}
          onPress={() => downloadFile()}
        >
          <Image
            source={waverSource}
            style={{
              height: 450,
              width: "100%",
              resizeMode: "contain",
              backgroundColor: "#F3F4F6",
            }}
          />
        </TouchableOpacity>

        <Text style={{ fontSize: 14, marginBottom: 4, color: "#374151" }}>
          • Fill up the form with the necessary details
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 12, color: "#374151" }}>
          • Go to the CTU Danao Fitness Gym, and submit the form to be approved
          by the stationed admin
        </Text>

        {/* Thank You Section */}
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 26,
              color: "#22C55E", // green
              marginBottom: 6,
            }}
          >
            THANK YOU!
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              color: "#2563EB", // blue
            }}
          >
            We will be waiting for you there!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
