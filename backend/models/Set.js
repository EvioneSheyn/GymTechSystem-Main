import Exercise from "./Exercise";

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Set = sequelize.define("Set", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(["Secs", "Reps"]),
    allowNull: false,
  },
});

Set.belongsTo(Exercise, { foreignKey: "exerciseId" });
Set.belongsTo(Routine, { foreignKey: "routineId" });

module.exports = Set;
