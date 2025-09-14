const User = require("./User");
const Plan = require("./Plan");
const Set = require("./Set");
const Routine = require("./Routine");
const Exercise = require("./Exercise");
const WorkoutSession = require("./WorkoutSession");
const Profile = require("./Profile");
const Meal = require("./Meal");
const Food = require("./Food");
const MealFood = require("./MealFood");
const WeightRecord = require("./WeightRecord");
const Goal = require("./Goal");

User.hasMany(Routine, {
  foreignKey: "routineableId",
  constraints: false,
  scope: { routineableType: "User" },
  as: "routines",
  onDelete: "CASCADE",
});

User.hasMany(WorkoutSession, {
  foreignKey: "userId",
  constraints: false,
  as: "sessions",
  onDelete: "CASCADE",
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
  onDelete: "CASCADE",
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
  onDelete: "CASCADE",
});
Exercise.hasMany(Set, {
  foreignKey: "exerciseId",
  as: "sets",
  onDelete: "CASCADE",
});

Set.belongsTo(Exercise, { foreignKey: "exerciseId", as: "exercise" });
Set.belongsTo(Routine, { foreignKey: "routineId", as: "routine" });

Profile.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Profile, { foreignKey: "userId", as: "profile" });

Meal.belongsToMany(Food, {
  through: MealFood,
  foreignKey: "mealId",
  otherKey: "foodId",
  as: "foods",
});

Food.belongsToMany(Meal, {
  through: MealFood,
  foreignKey: "foodId",
  otherKey: "mealId",
  as: "meals",
});

MealFood.belongsTo(Meal, { foreignKey: "mealId", as: "meal" });
Meal.hasMany(MealFood, {
  foreignKey: "mealId",
  as: "mealFoods",
  onDelete: "CASCADE",
});

MealFood.belongsTo(Food, { foreignKey: "foodId", as: "food" });
Food.hasMany(MealFood, {
  foreignKey: "foodId",
  as: "mealFoods",
  onDelete: "CASCADE",
});

Meal.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Meal, { foreignKey: "userId", as: "meals", onDelete: "CASCADE" });

User.hasMany(WeightRecord, {
  foreignKey: "userId",
  as: "weightRecords",
  onDelete: "CASCADE",
});
WeightRecord.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Goal, { foreignKey: "userId", as: "goals", onDelete: "CASCADE" });
Goal.belongsTo(User, { foreignKey: "userId", as: "user" });
