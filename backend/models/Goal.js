const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Goal = sequelize.define("Goal", {
  type: {
    type: DataTypes.ENUM(["workout", "weight"]),
    allowNull: false,
  },
  from: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  target: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  progress: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Goal;
