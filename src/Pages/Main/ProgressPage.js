import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import PagesLayout from "../../Layouts/PagesLayout";

const ProgressPage = () => {
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
          Weight Progress
        </Text>
      </View>
      <View>
      </View>
    </PagesLayout>
  );
};

export default ProgressPage;

const styles = StyleSheet.create({});
