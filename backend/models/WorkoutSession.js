const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WorkoutSession = sequelize.define("WorkoutSession", {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  routineId: {
    type: DataTypes.INTEGER,
    unique: true,
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
});

module.exports = WorkoutSession;
