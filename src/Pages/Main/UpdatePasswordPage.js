import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "@/Axios";

const UpdatePasswordPage = () => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword =
        "New password cannot be the same as current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const response = await api.patch("/api/user/change-password", {
        oldPassword: currentPassword,
        newPassword: newPassword,
        confirmedNewPassword: confirmPassword,
      });

      if (response.status === 200) {
        Alert.alert("Success", response.data.message);
        // reset state
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});

        // navigate back to settings
        navigation.navigate("Settings");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        // Convert errors array into object: { field: message }
        const errorObj = {};
        error.response.data.errors.forEach((err) => {
          errorObj[err.param] = err.msg;
        });
        setErrors(errorObj);
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    navigation.goBack();
  };

  const renderPasswordInput = (
    label,
    value,
    setValue,
    visible,
    setVisible,
    errorKey
  ) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          errors[errorKey] ? styles.inputErrorWrapper : null,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#555"
          secureTextEntry={!visible}
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <MaterialIcons
            name={visible ? "visibility" : "visibility-off"}
            size={22}
            color={errors[errorKey] ? "#f87171" : "#aaa"}
          />
        </TouchableOpacity>
      </View>
      {errors[errorKey] && (
        <Text style={styles.errorText}>{errors[errorKey]}</Text>
      )}
    </View>
  );

  return (
    <PagesLayout>
      <ScrollView style={{ paddingBottom: 120 }}>
        {/* Header */}
        <Text style={styles.header}>Update Password</Text>
        <Text style={styles.subHeader}>Change your account password</Text>

        {/* Password Update Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password Details</Text>

          {renderPasswordInput(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrent,
            setShowCurrent,
            "currentPassword"
          )}
          {renderPasswordInput(
            "New Password",
            newPassword,
            setNewPassword,
            showNew,
            setShowNew,
            "newPassword"
          )}
          {renderPasswordInput(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            setShowConfirm,
            "confirmPassword"
          )}
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

export default UpdatePasswordPage;

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
    marginBottom: 12,
  },
  itemRow: {
    marginBottom: 16,
  },
  itemText: {
    fontSize: 14,
    color: "white",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
  },
  inputErrorWrapper: {
    borderWidth: 1,
    borderColor: "#f87171",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#f87171", // red error text
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
