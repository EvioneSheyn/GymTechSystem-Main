const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Meal = sequelize.define("Meal", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mealType: {
    type: DataTypes.ENUM("breakfast", "lunch", "dinner", "snack"),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Meal;
  