import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PagesLayout from "../../Layouts/PagesLayout";

const TrackMeal = () => {
  return (
    <PagesLayout>
      <View>
        <Text style={styles.subHeader}>Details of</Text>
        <Text style={styles.mainHeader}>Caloric Balance</Text>
      </View>
    </PagesLayout>
  );
};

export default TrackMeal;

const styles = StyleSheet.create({
  mainHeader: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subHeader: {
    color: "#aaa",
  },
});
