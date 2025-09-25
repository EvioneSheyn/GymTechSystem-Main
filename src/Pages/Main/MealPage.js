import {
  Alert,
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
import { useNavigation } from "@react-navigation/native";
import { api } from "@/Axios";

const MealPage = () => {
  const options = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const navigation = useNavigation();

  const getMealStatus = () => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      hour12: false,
    });

    const hours = Number(formatter.format(new Date()));

    if (hours < 12) return "Breakfast";
    if (hours < 18) return "Lunch";
    return "Dinner";
  };

  const startMealType = getMealStatus();
  const [mealType, setMealType] = useState(startMealType);
  const [foods, setFoods] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const fetchMealFoods = async () => {
    try {
      const response = await api.post("/api/meal/by-type", {
        mealType,
      });

      if (response.status === 200) {
        console.log(response.data);
        setFoods(response.data.foods);
      }
    } catch (error) {
      console.log("Fetch meal foods error: ", error.response.data.message);

      if (error.status === 404) {
        setFoods([]);
      }
    }
  };

  useEffect(() => {
    fetchMealFoods();
  }, [mealType]);

  function promptDeleteMeal(food) {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteMeal(food) },
      ],
      { cancelable: true }
    );
  }

  async function deleteMeal(food) {
    try {
      const response = await api.post("/api/meal/delete", {
        mealId: food.mealId,
        foodId: food.foodId,
      });

      if (response.status == 200) {
        fetchMealFoods();
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <PagesLayout style={{ flexGrow: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <WhiteText
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 12,
            }}
          >
            Your Meals
          </WhiteText>
          <TouchableOpacity onPress={() => setEditMode((prev) => !prev)}>
            <WhiteText>{editMode ? "Done" : "Edit"}</WhiteText>
          </TouchableOpacity>
        </View>
        <RadioSet>
          {options.map((item, index) => (
            <RadioButton
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: mealType === item ? "#94a3b8" : "transparent",
                borderRadius: 24,
              }}
              color={"white"}
              label={item}
              key={index}
              selected={mealType === item}
              onPress={() => setMealType(item)}
            />
          ))}
        </RadioSet>
        <ScrollView style={{ marginTop: 18 }}>
          {foods.map((meal, index) => (
            <View style={{ flexDirection: "row" }} key={index}>
              <View style={styles.foodContainer}>
                <Image
                  source={{
                    uri: meal.food.imageUrl,
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
                      {meal.food.name}
                    </WhiteText>
                    <WhiteText style={{ fontSize: 12, fontWeight: 600 }}>
                      🍗 {meal.totalCalories} kcal
                    </WhiteText>
                  </View>
                  <WhiteText
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: "#ddd",
                    }}
                  >
                    {meal.quantity} {meal.food.unit}
                  </WhiteText>
                </View>
              </View>
              {editMode && (
                <View
                  style={{
                    width: 30,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableOpacity onPress={() => promptDeleteMeal(meal)}>
                    <MaterialIcons
                      name="delete"
                      size={22}
                      style={{ color: "rgba(243, 82, 82, 1)" }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </PagesLayout>
      <View style={styles.absoluteAddButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            navigation.navigate("Food", { mealType: mealType });
          }}
        >
          <MaterialIcons name="add" style={{ color: "white", fontSize: 32 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealPage;

const styles = StyleSheet.create({
  foodContainer: {
    flexDirection: "row",
    height: 65,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    alignItems: "center",
    padding: 12,
    gap: 12,
    flexGrow: 1,
    marginBottom: 8,
  },
  absoluteAddButtonContainer: {
    flexDireciton: "row",
    alignItems: "flex-end",
    marginTop: 12,
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  addButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#5bce7eff",
  },
});
