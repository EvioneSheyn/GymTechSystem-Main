import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { MaterialIcons } from "@expo/vector-icons";
import ModalComponent from "../../Components/ModalComponent";
import RNPickerSelect from "react-native-picker-select";
import { Button, TextInput } from "react-native-paper";
import api from "@/Axios";
const GoalPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState([]);

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
  };

  const createGoal = async () => {
    if (!form.target || !form.type) {
      alert("Fill up necessary details. " + JSON.stringify(form));
      return;
    }

    try {
      const response = await api.post("/api/goal", form);

      alert(response.data.message);
      setShowModal(false);
      setForm({});
      fetchGoals();
    } catch (error) {
      alert(error.response.data.message);
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
    Alert.alert("Deleting Goal", "Do you really wish to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", onPress: () => deleteGoal(id) },
    ]);
  };

  async function deleteGoal(id) {
    try {
      const response = await api.delete("/api/goal/" + id);

      alert(response.data.message);
      fetchGoals();
    } catch (error) {
      alert(error.response.data.message);
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
              <View
                style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
              >
                <TextInput
                  style={{ flex: 1 }}
                  label={"Enter Target"}
                  keyboardType="numeric"
                  onChangeText={(value) => handleFormChange("target", value)}
                  value={form.target}
                />
                <Text>
                  {form.type != undefined
                    ? form.type == "workout"
                      ? "sessions"
                      : "KG"
                    : ""}
                </Text>
              </View>
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
});
