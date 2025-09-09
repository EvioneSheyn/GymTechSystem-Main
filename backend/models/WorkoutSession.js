const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WorkoutSession = sequelize.define("WorkoutSession", {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  routineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caloriesBurned: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(),
  },
});

module.exports = WorkoutSession;
