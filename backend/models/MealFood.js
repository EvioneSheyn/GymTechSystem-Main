const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Food = require("./Food");
const Meal = require("./Meal");

const MealFood = sequelize.define("MealFood", {
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false, // e.g., 1.5 servings
  },
  totalCalories: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Relations

module.exports = MealFood;
