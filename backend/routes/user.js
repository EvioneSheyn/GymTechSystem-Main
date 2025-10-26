const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Meal = require("../models/Meal");
const MealFood = require("../models/MealFood");
const WorkoutSession = require("../models/WorkoutSession");
const WeightRecord = require("../models/WeightRecord");
const Goal = require("../models/Goal");
const Routine = require("../models/Routine");
const Set = require("../models/Set");
const sequelize = require("../config/db");
const { body, validationResult } = require("express-validator");

// Verification update (originally GET /verification-update)
router.get("/verification-update", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const user = await User.findByPk(userId);
    return res.status(200).json({
      message: "Fetching update complete!",
      authenticated: user.verifiedAt,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching verification", error: err.message });
  }
});

router.patch(
  "/change-password",
  auth,
  [
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Current password is required"),
    ,
    body("newPassword")
      .trim()
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
    ,
    body("confirmedNewPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirmed password does not match new password");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmedNewPassword } = req.body;
    try {
      const user = await User.findByPk(userId);
      if (!user) return res.status(400).json({ message: "User not found!" });

      if (newPassword !== confirmedNewPassword) {
        return res
          .status(400)
          .json({ message: "New passwords don't match, try again" });
      }

      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match)
        return res.status(401).json({
          message: "Incorrect Password!",
        });

      user.update({
        password: newPassword,
      });

      return res.status(200).json({
        message: "Succesfully changed your account password.",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Error changing account password: ",
        error: err.message,
      });
    }
  }
);

router.delete("/delete-account", auth, async (req, res) => {
  const userId = req.user.userId;
  
  const transaction = await sequelize.transaction();
  
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete all user-related data in order
    // 1. Delete MealFood records
    const userMeals = await Meal.findAll({ where: { userId }, attributes: ['id'], transaction });
    if (userMeals.length > 0) {
      const mealIds = userMeals.map(meal => meal.id);
      await MealFood.destroy({ where: { mealId: mealIds }, transaction });
    }

    // 2. Delete Sets from user routines
    const userRoutines = await Routine.findAll({ 
      where: { routineableId: userId, routineableType: 'User' }, 
      attributes: ['id'], 
      transaction 
    });
    if (userRoutines.length > 0) {
      const routineIds = userRoutines.map(routine => routine.id);
      await Set.destroy({ where: { routineId: routineIds }, transaction });
    }

    // 3. Delete user routines
    await Routine.destroy({ 
      where: { routineableId: userId, routineableType: 'User' }, 
      transaction 
    });

    // 4. Delete other user data
    await WorkoutSession.destroy({ where: { userId }, transaction });
    await WeightRecord.destroy({ where: { userId }, transaction });
    await Goal.destroy({ where: { userId }, transaction });
    await Meal.destroy({ where: { userId }, transaction });
    await Profile.destroy({ where: { userId }, transaction });

    // 5. Finally delete the user
    await user.destroy({ transaction });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      message: "Successfully deleted your account and all associated data.",
    });
  } catch (err) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error("Delete account error:", err);
    return res
      .status(500)
      .json({ message: "Error deleting account: " + err.message });
  }
});

module.exports = router;
