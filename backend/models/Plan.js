const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Plan = sequelize.define("Plan", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isFinished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Plan;
