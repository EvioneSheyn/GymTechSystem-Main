import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  ScrollView 
} from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [useKg, setUseKg] = useState(true);
  const [reminders, setReminders] = useState(true);

  return (
    <PagesLayout>
      <ScrollView style={{paddingBottom: 120}}>
        {/* Header */}
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subHeader}>Manage your preferences</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity style={styles.itemRow}>
            <Text style={styles.itemText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Use Kg</Text>
            <Switch value={useKg} onValueChange={setUseKg} />
          </View>
          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Reminders</Text>
            <Switch value={reminders} onValueChange={setReminders} />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.itemRow}>
            <Text style={styles.itemText}>Change Password</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.itemRow}>
            <Text style={[styles.itemText, { color: "red" }]}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.itemRow}>
            <Text style={[styles.itemText, { color: "red" }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.itemText}>App version 1.0.0</Text>
        </View>
      </ScrollView>
    </PagesLayout>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  subHeader: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 16,
  },
  section: {
    marginVertical: 12,
    padding: 14,
    backgroundColor: "#1e293b",
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 14,
    color: "white",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#2e3a4d",
    marginVertical: 4,
  },
});
