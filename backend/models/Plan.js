const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Plan = sequelize.define("Plan", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Plan;
