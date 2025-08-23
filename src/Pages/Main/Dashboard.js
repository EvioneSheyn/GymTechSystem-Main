import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  LinearGradient,
} from "react-native";
import { Image } from "expo-image";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/Axios";
import Profile from "@/Components/Profile";
import MainNav from "@/Components/MainNav";

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + i);
  return {
    key: date.getDate() - date.getDay() + i,
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    date: date.getDate().toString().padStart(2, "0"),
  };
});

const quickActions = [
  {
    label: "Workouts",
    icon: "play-circle",
    color: "#3B82F6",
    screen: "Workout",
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
  const [profile, setProfile] = useState(
    AsyncStorage.getItem("profile")
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error("Failed to load user", error.message);
      }
    };

    const getProfile = async () => {
      try {
        const response = await api.get("/api/profile");
        if (response.data.profile) {
          let profile = response.data.profile;
          setProfile(profile);
          await AsyncStorage.setItem(
            "profile",
            JSON.stringify(profile)
          );
        }
      } catch (error) {
        console.log("Failed to fetch profile", error.message);
      }
    };

    loadUser();
    getProfile();
  }, []);

  const handleLogout = () => {
    // TODO add logout logic

    AsyncStorage.removeItem("jwtToken");
    navigation.navigate("AuthNavigator", { screen: "Login" });
  };

  if (!profile) {
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
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutBtn}
            >
              <MaterialIcons
                name="logout"
                size={24}
                color="#F87171"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar")}
          >
            <Text style={{ color: "white", fontSize: 12 }}>
              View Calendar
            </Text>
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
                style={[
                  styles.dateItem,
                  isToday && styles.dateItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    isToday && styles.dateTextSelected,
                  ]}
                >
                  {item.date}
                </Text>
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.dayTextSelected,
                  ]}
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
              style={[
                styles.actionCard,
                { borderColor: action.color + "AA" },
              ]}
            >
              <Ionicons
                name={action.icon}
                size={28}
                color={action.color}
              />
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
