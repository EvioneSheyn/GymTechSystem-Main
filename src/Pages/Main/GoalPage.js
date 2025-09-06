import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import ModalComponent from "../../Components/ModalComponent";

const GoalPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <PagesLayout
      showModal={showModal}
      modal={
        <ModalComponent onClose={() => setShowModal(false)}>
          <View style={styles.modalCenterView}>
            <Text style={styles.modalTitleText}>Set New Goal</Text>
            {/* Input field(s) for goal */}
          </View>
        </ModalComponent>
      }
    >
      {/* Header */}
      <Text style={styles.subHeader}>Customize</Text>
      <Text style={styles.mainHeader}>My Goals</Text>

      {/* Goal Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Weight Goal</Text>
          <Text style={styles.goalValue}>60 Kg</Text>
          <View style={styles.outerBar}>
            <View style={[styles.innerBar, { width: "40%" }]}></View>
          </View>
        </View>
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Workout Goal</Text>
          <Text style={styles.goalValue}>3/5 sessions</Text>
          <View style={styles.outerBar}>
            <View style={[styles.innerBar, { width: "60%" }]}></View>
          </View>
        </View>
      </View>

      {/* Add Goal Button */}
      <TouchableOpacity
        style={styles.addGoalButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Add / Edit Goals
        </Text>
      </TouchableOpacity>
    </PagesLayout>
  );
};

export default GoalPage;

const styles = StyleSheet.create({
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
    height: 200,
    width: 300,
    borderRadius: 12,
    padding: 14,
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
