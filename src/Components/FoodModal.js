import api from "@/Axios";
import { WhiteText } from "@/Components/WhiteText";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function FoodModal({
  setShowModal,
  selectedFood,
  mealType,
  navigation,
}) {
  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) {
      setQuantity(1);
      Alert.alert("Error", "Quantity cannot be 0");
      return;
    }

    try {
      const response = await api.post("/api/meal/add", {
        foodId: selectedFood.id,
        quantity: quantity,
        mealType: mealType,
      });

      console.log("nisud diri: ", response.data);

      if (response.status === 200) {
        navigation.navigate("Meal");
      }
    } catch (error) {
      alert("Error selecting food: " + error.response.data.error);
    }

    setShowModal(false);
  };

  const [quantity, setQuantity] = useState(1);

  const normalizeQty = () => {
    if (!quantity || quantity <= 1) {
      setQuantity(1);
    }
  };

  const totalCalories =
    selectedFood?.calories && quantity
      ? formatCalories(Number(quantity) * Number(selectedFood.calories))
      : "0";

  function formatCalories(value) {
    if (!value) return "0";
    const decimals = (value.toString().split(".")[1] || "").length;

    return decimals > 2 ? value.toFixed(2) : value.toString();
  }

  const handleQtyIncrement = () => {
    setQuantity((prev) => prev + 1);
  };
  const handleQtyDecrement = () => {
    if (quantity == 1) {
      return;
    }

    setQuantity((prev) => prev - 1);
  };

  if (!selectedFood) return;

  return (
    <View style={styles.foodModalContainer}>
      <Pressable style={styles.backdrop} onPress={() => setShowModal(false)} />
      <View style={styles.foodModalCenterView}>
        <Image
          source={{
            uri: "https://assets.epicurious.com/photos/62f16ed5fe4be95d5a460eed/16:9/w_5803,h_3264,c_limit/RoastChicken_RECIPE_080420_37993.jpg",
          }}
          height={"70%"}
          width={"100%"}
          borderRadius={12}
          marginTop={-50}
        />
        <View
          style={{
            paddingHorizontal: 12,
          }}
        >
          <Text style={styles.foodText}>{selectedFood.name}</Text>
          <View style={styles.foodSizeGroup}>
            <View style={styles.foodQtyGroup}>
              <TouchableOpacity onPress={handleQtyDecrement}>
                <MaterialIcons name="remove" />
              </TouchableOpacity>
              <TextInput
                style={styles.servingSizeText}
                onChangeText={setQuantity}
              >
                {quantity}
              </TextInput>
              <TouchableOpacity onPress={handleQtyIncrement}>
                <MaterialIcons name="add" />
              </TouchableOpacity>
              <Text>{selectedFood.unit}</Text>
            </View>
            <Text style={{ fontWeight: "600" }}>
              🍗
              {totalCalories} kcal
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <WhiteText>Cancel</WhiteText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalAddButton}
              onPress={handleSubmit}
            >
              <WhiteText>Add</WhiteText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  foodQtyGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  foodSizeGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  backdrop: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "#3333339d",
  },
  servingSizeText: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  foodModalContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  foodModalCenterView: {
    backgroundColor: "#ddd",
    height: 250,
    width: 300,
    borderRadius: 24,
  },
  cancelButton: {
    backgroundColor: "#ff5d5dff",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  modalAddButton: {
    backgroundColor: "#78db64ff",
    fontWeight: "bold",
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});
