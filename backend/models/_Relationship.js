const User = require("./User");
const Plan = require("./Plan");
const Set = require("./Set");
const Routine = require("./Routine");
const Exercise = require("./Exercise");
const WorkoutSession = require("./WorkoutSession");
const Profile = require("./Profile");

User.hasMany(Routine, {
  foreignKey: "routineableId",
  constraints: false,
  scope: { routineableType: "User" },
  as: "routines",
});

User.hasMany(WorkoutSession, {
  foreignKey: "userId",
  constraints: false,
  as: "sessions",
});

WorkoutSession.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Plan.hasMany(Routine, {
  foreignKey: "routineableId",
  constraints: false,
  scope: { routineableType: "Plan" },
  as: "routines",
});

Routine.belongsTo(User, {
  foreignKey: "routineableId",
  constraints: false,
  as: "user",
});
Routine.belongsTo(Plan, {
  foreignKey: "routineableId",
  constraints: false,
  as: "plan",
});

Routine.hasMany(Set, {
  foreignKey: "routineId",
  as: "sets",
});
Exercise.hasMany(Set, {
  foreignKey: "exerciseId",
  as: "sets",
});

Set.belongsTo(Exercise, { foreignKey: "exerciseId", as: "exercise" });
Set.belongsTo(Routine, { foreignKey: "routineId", as: "routine" });

Profile.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Profile, { foreignKey: "userId", as: "profile" });
