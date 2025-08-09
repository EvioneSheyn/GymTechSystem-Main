import { DataTypes } from "sequelize";
import User from "./User";
import Plan from "./Plan";
const sequelize = require("../config/db");

const Routine = sequelize.define("Routine", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  routineableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  routineableType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Routine, {
  foreignKey: "routineableId",
  constraints: false,
  scope: { routineableType: "User" },
});

Plan.hasMany(Routine, {
  foreignKey: "routineableId",
  constraints: false,
  scope: { routineableType: "Plan" },
});

Routine.belongsTo(User, {
  foreignKey: "routineableId",
  constraints: false,
});
Routine.belongsTo(Plan, {
  foreignKey: "routineableId",
  constraints: false,
});

Routine.hasMany(Set, {
  foreignKey: "exerciseId",
});

module.exports = Routine;
