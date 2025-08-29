import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "@/Layouts/PagesLayout";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { WhiteText } from "@/Components/WhiteText";
import RadioSet from "@/Components/RadioSet";
import { RadioButton } from "@/Components/RadioButton";
import api from "@/Axios";
import { useNavigation, useRoute } from "@react-navigation/native";

const FoodPage = () => {
  const options = ["Main", "Side", "Dessert", "Appetizer"];
  const route = useRoute();
  const navigation = useNavigation();
  const { mealType } = route.params;

  const [foodCategory, setFoodCategory] = useState();
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState({});

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await api.get("/api/foods");

        if (response.status === 200) {
          setFoods(response.data.foods);
        }
      } catch (error) {
        alert(error.response.data.message);
        console.log("ni error diri");
      }
    };

    fetchFoods();
  }, []);

  const selectFood = async (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  return (
    <PagesLayout
      isLoading={!foods}
      modal={
        <FoodModal
          setShowModal={setShowModal}
          selectedFood={selectedFood}
          mealType={mealType}
          navigation={navigation}
        />
      }
      showModal={showModal}
    >
      <View style={styles.headerView}>
        <WhiteText style={styles.headerTitle}>
          Select a Food
        </WhiteText>

        <TouchableOpacity style={styles.addButton}>
          <WhiteText style={{ fontSize: 14, fontWeight: "bold" }}>
            Create Food
          </WhiteText>
          <MaterialIcons
            name="add-circle"
            style={{ color: "white", fontSize: 18 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={{ flexGrow: 1 }}
          placeholder="Search here"
        />
        <TouchableOpacity>
          <MaterialIcons name="search" style={{ fontSize: 24 }} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <RadioSet>
          {options.map((item, index) => (
            <RadioButton
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor:
                  foodCategory === item ? "#94a3b8" : "transparent",
                borderRadius: 24,
              }}
              color={"white"}
              label={item}
              key={index}
              selected={foodCategory === item}
              onPress={() => setFoodCategory(item)}
            />
          ))}
        </RadioSet>
        {foodCategory && (
          <TouchableOpacity
            onPress={() => {
              setFoodCategory(null);
            }}
          >
            <MaterialIcons
              name="close"
              style={{ color: "white", fontSize: 24 }}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ marginTop: 12, marginBottom: 42 }}>
        {foods.map((food, index) => (
          <TouchableOpacity
            style={styles.foodContainer}
            key={index}
            onPress={() => selectFood(food)}
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
                  {food.name}
                </WhiteText>
                <View style={{ alignItems: "flex-end" }}>
                  <WhiteText style={styles.calorieText}>
                    🍗 {food.calories} kcal
                  </WhiteText>
                  <WhiteText style={styles.unitText}>
                    per {food.unit}
                  </WhiteText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </PagesLayout>
  );
};

export default FoodPage;
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    borderRadius: 24,
    alignItems: "center",
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  foodContainer: {
    flexDirection: "row",
    height: 65,
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    alignItems: "center",
    padding: 12,
    gap: 12,
    flexGrow: 1,
    marginBottom: 12,
  },
  unitText: {
    fontSize: 10,
    fontWeight: 500,
    color: "#ddd",
  },
  calorieText: {
    fontSize: 12,
    fontWeight: 600,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#eeb109ff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 24,
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
    height: 300,
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

function FoodModal({
  setShowModal,
  selectedFood,
  mealType,
  navigation,
}) {
  const handleSubmit = async () => {
    try {
      const response = await api.post("/api/add-meal", {
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
  const [quantity, setQuantity] = useState("1");
  const totalCalories =
    selectedFood?.calories && quantity
      ? formatCalories(
          Number(quantity) * Number(selectedFood.calories)
        )
      : "0";

  function formatCalories(value) {
    if (!value) return "0";
    const decimals = (value.toString().split(".")[1] || "").length;

    return decimals > 2 ? value.toFixed(2) : value.toString();
  }

  if (!selectedFood) return;

  return (
    <View style={styles.foodModalContainer}>
      <Pressable
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "#3333339d",
        }}
        onPress={() => setShowModal(false)}
      />
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
        <View style={{ paddingHorizontal: 12 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 12,
            }}
          >
            {selectedFood.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <TextInput
                keyboardType="numeric"
                defaultValue={quantity}
                onChangeText={(text) => setQuantity(text)}
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                }}
              />
              <Text>{selectedFood.unit}</Text>
            </View>
            <Text style={{ fontWeight: "600" }}>
              🍗
              {totalCalories} kcal
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            justifyContent: "flex-end",
            marginRight: 12,
          }}
        >
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
  );
}
