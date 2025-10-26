const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Food = require("../models/Food");
const Meal = require("../models/Meal");
const MealFood = require("../models/MealFood");

// Add foods (originally POST /add-foods)
router.post("/add-foods", async (req, res) => {
  const { foods } = req.body;
  try {
    await Food.bulkCreate(foods);
    return res.status(200).json({ message: "Successfully added foods" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when adding foods",
      error: error.message,
    });
  }
});

// Reset/Delete all foods
router.delete("/reset-foods", async (req, res) => {
  try {
    await Food.destroy({ where: {} });
    return res.status(200).json({ message: "Successfully reset all foods" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when resetting foods",
      error: error.message,
    });
  }
});

// Update food images from JSON data
router.put("/update-food-images", async (req, res) => {
  const { foods } = req.body;
  try {
    let updatedCount = 0;
    
    for (const foodData of foods) {
      const [updatedRows] = await Food.update(
        { imageUrl: foodData.imageUrl },
        { where: { name: foodData.name } }
      );
      updatedCount += updatedRows;
    }
    
    return res.status(200).json({ 
      message: `Successfully updated ${updatedCount} food images`,
      updatedCount 
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when updating food images",
      error: error.message,
    });
  }
});

// Get foods (originally GET /foods)
router.get("/", async (req, res) => {
  const { category } = req.query;
  try {
    let foods;
    if (category) {
      foods = await Food.findAll({ where: { category } });
    } else {
      foods = await Food.findAll();
    }
    return res.status(200).json({ message: "Successfully retrieved foods", foods });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving foods",
      error: error.message,
    });
  }
});

// Add food to meal (originally POST /add-meal)
router.post("/add", auth, async (req, res) => {
  const { foodId, quantity, mealType } = req.body;
  const userId = req.user.userId;

  try {
    const today = new Date().toISOString().split("T")[0];

    // Find or create meal
    let meal = await Meal.findOne({ where: { userId, mealType, date: today } });
    if (!meal) {
      meal = await Meal.create({ userId, mealType, date: today });
    }

    const food = await Food.findByPk(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    // Find or create meal-food relationship
    let mealFood = await MealFood.findOne({ where: { mealId: meal.id, foodId: food.id } });
    if (!mealFood) {
      await MealFood.create({
        mealId: meal.id,
        foodId,
        quantity,
        totalCalories: food.calories * quantity,
      });
    } else {
      await mealFood.update({
        quantity: mealFood.quantity + quantity,
        totalCalories: mealFood.totalCalories + food.calories * quantity,
      });
    }

    return res.status(200).json({ message: "Successfully added food to meal!" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when adding food to meal",
      error: error.message,
    });
  }
});

// Get foods in a meal (originally POST /meal)
router.post("/by-type", auth, async (req, res) => {
  const { mealType } = req.body;
  const userId = req.user.userId;

  try {
    const today = new Date().toISOString().split("T")[0];

    const meal = await Meal.findOne({ where: { userId, mealType, date: today } });
    if (!meal) return res.status(404).json({ message: "No meal yet!" });

    const foods = await MealFood.findAll({
      where: { mealId: meal.id },
      include: { model: Food, as: "food" },
    });

    return res.status(200).json({ message: "Successfully retrieved food from meal!", foods });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving foods",
      error: error.message,
    });
  }
});

// Total meal calories (originally POST /total-meal)
router.post("/total", auth, async (req, res) => {
  const { date } = req.body;
  const userId = req.user.userId;

  try {
    const meals = await Meal.findAll({
      where: { userId, date },
      include: {
        model: MealFood,
        as: "mealFoods",
        include: { model: Food, as: "food" },
      },
    });

    let totalCalories = 0;
    meals.forEach((meal) => {
      meal.mealFoods.forEach((mf) => {
        totalCalories += Number(mf.totalCalories) || 0;
      });
    });

    return res.status(200).json({ message: "Successfully retrieved meals", meals, totalCalories });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving meals",
      error: error.message,
    });
  }
});

// Delete meal food (originally POST /delete-meal)
router.post("/delete", auth, async (req, res) => {
  const { mealId, foodId } = req.body;

  try {
    const deleted = await MealFood.destroy({ where: { mealId, foodId } });
    if (!deleted) return res.status(404).json({ message: "Meal food not found" });

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error when deleting meal food",
      error: error.message,
    });
  }
});

module.exports = router;
