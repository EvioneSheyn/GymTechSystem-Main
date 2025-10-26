import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { MaterialIcons } from "@expo/vector-icons";
import ModalComponent from "../../Components/ModalComponent";
import RNPickerSelect from "react-native-picker-select";
import { Button, TextInput } from "react-native-paper";
import { api } from "@/Axios";
import ErrorHandler from "@/Components/ErrorHandler";
import FormField from "@/Components/FormField";
const GoalPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const OPTIONS = [
    { label: "Weight", value: "weight" },
    { label: "Workout", value: "workout" },
  ];

  const [form, setForm] = useState({});

  const handleFormChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear form errors when user starts typing
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.type) {
      errors.type = "Please select a goal type";
    }
    
    if (!form.target || form.target <= 0) {
      errors.target = "Please enter a valid target value";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createGoal = async () => {
    if (!validateForm()) return;

    try {
      const response = await api.post("/api/goal", form);

      setSuccessMessage(response.data.message);
      setShowModal(false);
      setForm({});
      setFormErrors({});
      fetchGoals();
    } catch (error) {
      if (error.response?.data?.errors) {
        // Convert errors array into object: { field: message }
        const errorObj = {};
        error.response.data.errors.forEach((err) => {
          errorObj[err.param] = err.msg;
        });
        setFormErrors(errorObj);
      } else {
        setErrorMessage(error.response?.data?.message || "Failed to create goal");
      }
    }
  };

  const getPercentage = (goal) => {
    console.log(goal);
    const target = goal.target - goal.from;
    const percentage = goal.progress / target;

    console.log(percentage);

    return `${percentage}%`;
  };

  const handleDeleting = (id) => {
    // Use a custom confirmation modal instead of Alert
    setShowDeleteModal(true);
    setGoalToDelete(id);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  async function deleteGoal(id) {
    try {
      const response = await api.delete("/api/goal/" + id);

      setSuccessMessage(response.data.message);
      fetchGoals();
      setShowDeleteModal(false);
      setGoalToDelete(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to delete goal");
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  async function fetchGoals() {
    try {
      const response = await api.get("/api/goal");
      console.log(response.data);
      setGoals(response.data.goals);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  return (
    <PagesLayout
      showModal={showModal}
      modal={
        <ModalComponent onClose={() => setShowModal(false)}>
          <View style={styles.modalCenterView}>
            <Text style={styles.modalTitleText}>Set New Goal</Text>
            <View style={styles.goalFormView}>
              <FormField label="Goal Type" error={formErrors.type} required>
                <View style={styles.pickerBorder}>
                  <RNPickerSelect
                    onValueChange={(value) => handleFormChange("type", value)}
                    items={OPTIONS}
                    placeholder={{
                      label: "Select Goal Type",
                      value: null,
                    }}
                    value={form.type}
                  />
                </View>
              </FormField>
              
              <FormField label="Target" error={formErrors.target} required>
                <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                  <TextInput
                    style={{ flex: 1 }}
                    label={"Enter Target"}
                    keyboardType="numeric"
                    onChangeText={(value) => handleFormChange("target", value)}
                    value={form.target}
                    error={!!formErrors.target}
                  />
                  <Text>
                    {form.type != undefined
                      ? form.type == "workout"
                        ? "sessions"
                        : "KG"
                      : ""}
                  </Text>
                </View>
              </FormField>
              
              <View style={{ alignItems: "flex-end" }}>
                <Button style={styles.createButton} onPress={createGoal}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Create
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </ModalComponent>
      }
    >
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
      
      {/* Header */}
      <Text style={styles.subHeader}>Customize</Text>
      <Text style={styles.mainHeader}>My Goals</Text>

      {/* Goal Cards */}
      <View style={styles.cardContainer}>
        {goals.map((value, index) => (
          <View style={styles.goalCard} key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.goalTitle}>
                {value.type.charAt(0).toUpperCase() + value.type.slice(1)} Goal
              </Text>
              <TouchableOpacity onPress={() => handleDeleting(value.id)}>
                <MaterialIcons
                  style={{ fontSize: 24, color: "red" }}
                  name={"delete"}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={styles.goalValue}
            >{`${value.from}/${value.target} ${value.unit}`}</Text>
            <View style={styles.outerBar}>
              <View
                style={[
                  styles.innerBar,
                  {
                    width: getPercentage(value),
                  },
                ]}
              ></View>
            </View>
          </View>
        ))}
      </View>

      {/* Add Goal Button */}
      <TouchableOpacity
        style={styles.addGoalButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Add Goals</Text>
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalComponent onClose={() => setShowDeleteModal(false)}>
          <View style={styles.modalCenterView}>
            <Text style={styles.modalTitleText}>Delete Goal</Text>
            <Text style={styles.modalSubText}>
              Are you sure you want to delete this goal? This action cannot be undone.
            </Text>
            <View style={styles.modalButtonGroupView}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() => deleteGoal(goalToDelete)}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalComponent>
      )}
    </PagesLayout>
  );
};

export default GoalPage;

const styles = StyleSheet.create({
  goalFormView: {
    flexDirection: "column",
    marginTop: 12,
    gap: 5,
  },
  pickerBorder: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 8,
  },
  createButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#3ad",
    marginTop: 12,
  },
  mainHeader: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
  },
  cardContainer: {
    marginTop: 16,
    flexDirection: "column",
    gap: 16,
  },
  goalCard: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
  },
  goalTitle: {
    color: "white",
    fontSize: 16,
  },
  goalValue: {
    color: "#aaa",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  outerBar: {
    backgroundColor: "#aaa",
    height: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  innerBar: {
    backgroundColor: "#3ad",
    height: "100%",
    borderRadius: 12,
  },
  addGoalButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 16,
    width: "100%",
    marginTop: 16,
  },
  modalCenterView: {
    backgroundColor: "white",
    minHeight: 200,
    width: 300,
    borderRadius: 12,
    padding: 14,
    zIndex: 15,
  },
  modalTitleText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#3ad",
    borderRadius: 12,
    marginTop: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(221,81,81,1)",
    borderRadius: 12,
    marginTop: 12,
    marginRight: 8,
  },
  modalButtonGroupView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
  },
});
