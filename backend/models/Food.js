const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Food = sequelize.define("Food", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false, // per serving, per 100g, per piece, etc.
  },
  category: {
    type: DataTypes.STRING, // appetizer, main, side, dessert
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING, // store link to image
    allowNull: true,
  },
});

module.exports = Food;
