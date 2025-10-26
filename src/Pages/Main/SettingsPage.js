import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { api } from "@/Axios";
import ErrorHandler from "@/Components/ErrorHandler";

const SettingsPage = () => {
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
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
            } catch (error) {
              setErrorMessage("Failed to logout. Please try again.");
            }
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    if (isDeleting) return; // Prevent multiple requests
    
    setIsDeleting(true);
    try {
      const response = await api.delete("/api/user/delete-account");
      
      if (response.status === 200) {
        // Show success message briefly before navigation
        setSuccessMessage("Account deleted successfully. Redirecting to login...");
        
        // Clear all stored data
        await AsyncStorage.clear();
        
        // Small delay to show success message
        setTimeout(() => {
          // Navigate to login screen
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
        }, 1500);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete account. Please try again.";
      setErrorMessage(errorMsg);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PagesLayout>
      <ErrorHandler 
        error={errorMessage} 
        onDismiss={() => setErrorMessage("")}
        type="error"
      />
      <ErrorHandler 
        error={successMessage} 
        onDismiss={() => setSuccessMessage("")}
        type="success"
      />
      <ScrollView style={{ paddingBottom: 120 }}>
        {/* Header */}
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subHeader}>Manage your preferences</Text>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.itemText}>Edit Profile</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => navigation.navigate("UpdatePassword")}
          >
            <Text style={styles.itemText}>Change Password</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.itemRow} onPress={handleLogout}>
            <Text style={[styles.itemText, { color: "#ef4444" }]}>Logout</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.itemRow} onPress={handleDeleteAccount}>
            <Text style={[styles.itemText, { color: "#ef4444" }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.itemText}>App version 1.0.0 Beta</Text>
          <View style={styles.divider} />
          <Text style={styles.itemText}>Developer: Paul</Text>
        </View>

        {/* Delete Account Confirmation Modal */}
        {showDeleteModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Account</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data including workouts, meals, and progress.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalDeleteButton, isDeleting && styles.modalDeleteButtonDisabled]}
                  onPress={confirmDeleteAccount}
                  disabled={isDeleting}
                >
                  <Text style={styles.modalDeleteText}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  arrow: {
    fontSize: 18,
    color: "#9ca3af",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  modalDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ef4444",
  },
  modalDeleteButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  modalCancelText: {
    color: "#374151",
    fontWeight: "600",
  },
  modalDeleteText: {
    color: "white",
    fontWeight: "600",
  },
});
