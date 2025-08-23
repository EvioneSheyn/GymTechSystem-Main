import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "@/Layouts/PagesLayout";
import { RadioButton } from "@/Components/RadioButton";
import { WhiteText } from "@/Components/WhiteText";
import RadioSet from "../../Components/RadioSet";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";

const MealPage = () => {
  const options = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  const [mealStatus, setMealStatus] = useState("");

  const getMealStatus = () => {
    const date = new Date();
    date.toLocaleString("en-US", { timeZone: "Asia/Manila" });

    switch (true) {
      case date.getHours() < 12:
        setMealStatus("Breakfast");
        break;
      case date.getHours() < 18:
        setMealStatus("Lunch");
        break;
      case date.getHours() >= 18:
        setMealStatus("Dinner");
        break;
    }
  };

  useEffect(() => {
    getMealStatus();
  }, []);

  return (
    <View style={{ flexGrow: 1 }}>
      <PagesLayout style={{ flexGrow: 1 }}>
        <WhiteText
          style={{
            fontWeight: "bold",
            fontSize: 20,
            marginBottom: 12,
          }}
        >
          Your Meals
        </WhiteText>
        <RadioSet>
          {options.map((item, index) => (
            <RadioButton
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor:
                  mealStatus === item ? "#94a3b8" : "transparent",
                borderRadius: 24,
              }}
              color={"white"}
              label={item}
              key={index}
              selected={mealStatus === item}
              onPress={() => setMealStatus(item)}
            />
          ))}
        </RadioSet>
        <ScrollView style={{ marginTop: 12 }}>
          <View
            style={{
              flexDirection: "row",
              height: 65,
              width: "100%",
              backgroundColor: "#1e293b",
              borderRadius: 24,
              alignItems: "center",
              padding: 12,
              gap: 12,
              flexGrow: 1,
            }}
          >
            <Image
              source={{
                uri: "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/16:9/w_5803,h_3264,c_limit/RoastChicken_RECIPE_080420_37993.jpg",
              }}
              height={40}
              width={40}
              borderRadius={12}
            />
            <View style={{ flexGrow: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <WhiteText style={{ fontWeight: "800" }}>
                  Chicken Inasal
                </WhiteText>
                <WhiteText style={{ fontSize: 12, fontWeight: 600 }}>
                  🍗 512 kcal
                </WhiteText>
              </View>
              <WhiteText
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "#ddd",
                }}
              >
                1.5 servings
              </WhiteText>
            </View>
          </View>
        </ScrollView>
      </PagesLayout>
      <View
        style={{
          flexDireciton: "row",
          alignItems: "flex-end",
          marginTop: 12,
          position: "absolute",
          bottom: 100,
          right: 20,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: "#5bce7eff",
          }}
        >
          <MaterialIcons
            name="add"
            style={{ color: "white", fontSize: 32 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealPage;

const styles = StyleSheet.create({});
