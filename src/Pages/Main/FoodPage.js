import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import PagesLayout from "@/Layouts/PagesLayout";
import { MaterialIcons } from "@expo/vector-icons";

import { Image } from "expo-image";
import { WhiteText } from "@/Components/WhiteText";
import RadioSet from "@/Components/RadioSet";
import { RadioButton } from "@/Components/RadioButton";
import { api } from "@/Axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FoodModal } from "../../Components/FoodModal";

const FoodPage = () => {
  const options = ["Main", "Side", "Dessert", "Appetizer"];
  const route = useRoute();
  const navigation = useNavigation();
  const { mealType } = route.params;

  const [foodCategory, setFoodCategory] = useState("");
  const [foods, setFoods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState({});

  useEffect(() => {
    const fetchFoods = async () => {
      console.log("fetching food");
      try {
        const response = await api.get("/api/meal", {
          params: { category: foodCategory.toLowerCase() },
        });

        if (response.status === 200) {
          setFoods(response.data.foods);
        }
      } catch (error) {
        alert(error.response.data.message);
        console.log("ni error diri");
      }
    };

    fetchFoods();
  }, [foodCategory]);

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
        <WhiteText style={styles.headerTitle}>Select a Food</WhiteText>

        {/* <TouchableOpacity style={styles.addButton}>
          <WhiteText style={{ fontSize: 14, fontWeight: "bold" }}>
            Create Food
          </WhiteText>
          <MaterialIcons
            name="add-circle"
            style={{ color: "white", fontSize: 18 }}
          />
        </TouchableOpacity> */}
      </View>

      {/* <View style={styles.searchContainer}>
        <TextInput style={{ flexGrow: 1 }} placeholder="Search here" />
        <TouchableOpacity>
          <MaterialIcons name="search" style={{ fontSize: 24 }} />
        </TouchableOpacity>
      </View> */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12
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
              setFoodCategory("");
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
                uri: food.imageUrl,
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
                <WhiteText style={{ fontWeight: "800" }}>{food.name}</WhiteText>
                <View style={{ alignItems: "flex-end" }}>
                  <WhiteText style={styles.calorieText}>
                    🍗 {food.calories} kcal
                  </WhiteText>
                  <WhiteText style={styles.unitText}>per {food.unit}</WhiteText>
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
export const styles = StyleSheet.create({
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
});
