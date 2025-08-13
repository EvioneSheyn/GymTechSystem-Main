const Exercise = require("./Exercise");
const Routine = require("./Routine");

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Set = sequelize.define("Set", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(["Secs", "Reps"]),
    allowNull: false,
  },
  routineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Set;
