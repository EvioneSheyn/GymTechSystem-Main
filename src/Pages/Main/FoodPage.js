import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import PagesLayout from "../../Layouts/PagesLayout";
import { Icon } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from "expo-image";

const FoodPage = () => {
  return (
    <PagesLayout>
      <Text>Select a</Text>
      <Text>Food</Text>
      {/* Add Search bar */}
      <ScrollView>
        <View>
          <Image />
          <TouchableOpacity
            style={{
              flexDirection: "row",
            }}
          >
            <Text>Crispy Pata</Text>
            <Text>100 kcal per serving</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PagesLayout>
  );
};

export default FoodPage;

const styles = StyleSheet.create({});
