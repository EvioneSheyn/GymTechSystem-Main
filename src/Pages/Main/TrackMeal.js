import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PagesLayout from "../../Layouts/PagesLayout";

const TrackMeal = () => {
  return (
    <PagesLayout>
      <View>
        <Text
          style={{
            color: "#aaa",
          }}
        >
          Details of
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          Caloric Balance
        </Text>
      </View>
    </PagesLayout>
  );
};

export default TrackMeal;

const styles = StyleSheet.create({});
