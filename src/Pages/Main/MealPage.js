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
import ErrorHandler from "@/Components/ErrorHandler";

const MealPage = () => {
  const options = ["Breakfast", "Lunch", "Dinner", "Snacks"];
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

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
    setShowDeleteModal(true);
    setFoodToDelete(food);
  }

  async function deleteMeal(food) {
    try {
      const response = await api.post("/api/meal/delete", {
        mealId: food.mealId,
        foodId: food.foodId,
      });

      if (response.status == 200) {
        fetchMealFoods();
        setShowDeleteModal(false);
        setFoodToDelete(null);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to delete meal");
    }
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <PagesLayout style={{ flexGrow: 1 }}>
        <ErrorHandler 
          error={errorMessage} 
          onDismiss={() => setErrorMessage("")}
          type="error"
        />
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
                  contentFit="cover"
                  placeholder="🍽️"
                  transition={200}
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Meal Item</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this meal item? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => deleteMeal(foodToDelete)}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    flexDirection: "row",
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  modalDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ef4444",
  },
  modalCancelText: {
    color: "#374151",
    fontWeight: "600",
  },
  modalDeleteText: {
    color: "white",
    fontWeight: "600",
  },
});
