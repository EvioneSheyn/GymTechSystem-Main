import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

const user = {
  name: "Alex",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const stats = [
  { label: "Workouts", value: 5, icon: "fitness-center", color: "#4e8cff" },
  {
    label: "Calories",
    value: 1200,
    icon: "local-fire-department",
    color: "#ff7c4e",
  },
  { label: "Progress", value: "80%", icon: "trending-up", color: "#34d399" },
];

const quickActions = [
  { label: "Start Workout", icon: "play-circle", color: "#4e8cff" },
  { label: "Track Meal", icon: "restaurant", color: "#ff7c4e" },
  { label: "Progress", icon: "bar-chart", color: "#34d399" },
  { label: "Goals", icon: "target", color: "#a855f7" },
];

const todaysWorkouts = [
  { id: "1", name: "Chest & Triceps", time: "08:00 AM", icon: "dumbbell" },
  { id: "2", name: "HIIT Cardio", time: "10:00 AM", icon: "running" },
  { id: "3", name: "Yoga", time: "06:00 PM", icon: "spa" },
];

export default function Dashboard({ logout }) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 32 }}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greet}>Good Morning,</Text>
                    <Text style={styles.name}>{user.name}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <TouchableOpacity
                        onPress={() => {
                            // Add your logout logic here
                            logout();
                        }}
                        style={{
                            marginLeft: 12,
                            backgroundColor: "#ff7c4e22",
                            padding: 8,
                            borderRadius: 8,
                        }}
                    >
                        <MaterialIcons name="logout" size={24} color="#ff7c4e" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                {stats.map((stat) => (
                    <View
                        key={stat.label}
                        style={[styles.statCard, { backgroundColor: stat.color + "22" }]}
                    >
                        <MaterialIcons name={stat.icon} size={28} color={stat.color} />
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickActions}
            >
                {quickActions.map((action) => (
                    <TouchableOpacity
                        key={action.label}
                        style={[
                            styles.actionCard,
                            { backgroundColor: action.color + "22" },
                        ]}
                    >
                        <Ionicons name={action.icon} size={28} color={action.color} />
                        <Text style={styles.actionLabel}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Today's Workouts */}
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            <FlatList
                data={todaysWorkouts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.workoutCard}>
                        <FontAwesome5
                            name={item.icon}
                            size={24}
                            color="#4e8cff"
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
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fc",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  greet: {
    fontSize: 18,
    color: "#888",
    fontFamily: "poppins",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#131833",
    fontFamily: "georgia",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#4e8cff",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    marginHorizontal: 4,
    backgroundColor: "#e0e7ff",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#131833",
    marginTop: 6,
    fontFamily: "poppins",
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
    fontFamily: "poppins",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#131833",
    marginBottom: 12,
    marginTop: 10,
    fontFamily: "poppins",
  },
  quickActions: {
    marginBottom: 28,
  },
  actionCard: {
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 16,
    marginRight: 16,
    minWidth: 110,
    backgroundColor: "#e0e7ff",
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#131833",
    fontFamily: "poppins",
    textAlign: "center",
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#131833",
    fontFamily: "poppins",
  },
  workoutTime: {
    fontSize: 14,
    color: "#4e8cff",
    fontFamily: "poppins",
  },
});
