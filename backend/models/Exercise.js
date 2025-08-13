const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Exercise = sequelize.define("Exercise", {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(["time", "reps"]),
    allowNull: false,
  },
  target: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instruction: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  video: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Exercise;
