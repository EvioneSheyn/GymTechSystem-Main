import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { api } from "@/Axios";
import { useNavigation } from "@react-navigation/native";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    dateOfBirth: "",
    height: "",
    gender: "Male",
  });
  const navigation = useNavigation();

  const [savedProfile, setSavedProfile] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const storedProfile = await AsyncStorage.getItem("profile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        setSavedProfile(parsed);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // only YYYY-MM-DD
  };

  const handleSave = async () => {
    try {
      const response = await api.patch("/api/profile", profile);

      if (response.status === 200) {
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        setSavedProfile(profile);
        alert("Profile updated!");
      } else {
        console.log("Something went wrong when changing profile");
      }
    } catch (error) {
      console.log("Error saving profile: ", error.response.data.message);
    }
  };

  const handleCancel = () => {
    if (savedProfile) {
      setProfile(savedProfile);
    }
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setProfile({
        ...profile,
        dateOfBirth: formatDate(selectedDate),
      });
    }
  };

  return (
    <PagesLayout>
      <ScrollView style={{ paddingBottom: 120 }}>
        {/* Header */}
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.subHeader}>Update your information</Text>

        {/* Profile Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          {/* Date of Birth */}
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Date of Birth</Text>
            {savedProfile?.dateOfBirth ? (
              <Text style={styles.currentValue}>
                Current:{" "}
                {format(new Date(savedProfile.dateOfBirth), "MMMM dd, yyyy")}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.selectButtonText}>
                {profile.dateOfBirth
                  ? format(new Date(profile.dateOfBirth), "MMMM dd, yyyy")
                  : "Select Date"}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={
                profile.dateOfBirth ? new Date(profile.dateOfBirth) : new Date()
              }
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Height */}
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Height (cm)</Text>
            {savedProfile?.height ? (
              <Text style={styles.currentValue}>
                Current: {savedProfile.height}
              </Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Enter Height"
              placeholderTextColor="#555"
              keyboardType="numeric"
              value={profile.height}
              onChangeText={(text) => setProfile({ ...profile, height: text })}
            />
          </View>

          {/* Gender */}
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>Gender</Text>
            {savedProfile?.gender ? (
              <Text style={styles.currentValue}>
                Current: {savedProfile.gender}
              </Text>
            ) : null}
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setProfile({ ...profile, gender: "Male" })}
              >
                <View
                  style={[
                    styles.radioCircle,
                    profile.gender === "Male" && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setProfile({ ...profile, gender: "Female" })}
              >
                <View
                  style={[
                    styles.radioCircle,
                    profile.gender === "Female" && styles.radioSelected,
                  ]}
                />
                <Text style={styles.radioText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PagesLayout>
  );
};

export default ProfilePage;

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
    marginBottom: 16,
  },
  itemText: {
    fontSize: 14,
    color: "white",
    marginBottom: 6,
  },
  currentValue: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 6,
    fontStyle: "italic",
  },
  selectButton: {
    backgroundColor: "#334155",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectButtonText: {
    color: "white",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#334155",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "white",
    fontSize: 14,
  },
  radioGroup: {
    flexDirection: "row",
    marginTop: 6,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "white",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  radioText: {
    color: "white",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
  },
  cancelButton: {
    backgroundColor: "#334155",
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "bold",
  },
});
