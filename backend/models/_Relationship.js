const User = require("./User");
const Plan = require("./Plan");
const Set = require("./Set");
const Routine = require("./Routine");
const Exercise = require("./Exercise");

Exercise.hasMany(Set, { foreignKey: "exerciseId" });

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

Set.belongsTo(Exercise, { foreignKey: "exerciseId" });
Set.belongsTo(Routine, { foreignKey: "routineId" });
