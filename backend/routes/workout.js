const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const auth = require("../middleware/auth");
const WorkoutSession = require("../models/WorkoutSession");
const Goal = require("../models/Goal");

// Finish exercise (originally POST /finish-exercise)
router.post("/finish-exercise", auth, async (req, res) => {
  const { routineId, caloriesBurned, duration } = req.body;
  const userId = req.user.userId;
  console.log("called");
  try {
    if (!userId || !routineId || !caloriesBurned || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const calories = parseFloat(caloriesBurned);
    const dur = parseInt(duration, 10);

    if (isNaN(calories) || isNaN(dur)) {
      return res
        .status(400)
        .json({ message: "Invalid number format for calories or duration" });
    }

    const workoutSession = await WorkoutSession.create({
      userId,
      routineId,
      caloriesBurned: calories, // ensure float
      duration: dur, // ensure integer
    });

    const userGoal = await Goal.findOne({
      where: {
        [Op.and]: [{ userId }, { completed: false }],
      },
    });

    console.log(userGoal);
    console.log(workoutSession);

    if (workoutSession && userGoal) {
      const progressIncremented = userGoal.progress + 1;

      if (progressIncremented < userGoal.target) {
        await userGoal.update({
          progress: progressIncremented,
          complete: progressIncremented == userGoal.target,
        });
      }
    }

    return res.status(200).json({ message: "Workout recording complete!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error recording workout " + error.message });
  }
});

// Get all workout sessions (originally GET /all-workout-sessions)
router.get("/all", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const sessions = await WorkoutSession.findAll({ where: { userId } });
    return res
      .status(200)
      .json({ message: "Successfully retrieved workout sessions", sessions });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving sessions", error: error.message });
  }
});

// Get sessions and calories burned by date (originally POST /workout-sessions)
router.post("/by-date", auth, async (req, res) => {
  const { date } = req.body;
  const userId = req.user.userId;

  try {
    const dateObj = new Date(date);
    const start = new Date(dateObj.setHours(0, 0, 0, 0));
    const end = new Date(dateObj.setHours(23, 59, 59, 999));

    const workoutSessions = await WorkoutSession.findAll({
      where: { userId, createdAt: { [Op.between]: [start, end] } },
    });

    const totalCaloriesBurned = workoutSessions.reduce(
      (acc, s) => acc + Number(s.caloriesBurned || 0),
      0
    );

    return res.status(200).json({
      message: "Successfully retrieved calories-burned record!",
      sessions: workoutSessions,
      caloriesBurned: totalCaloriesBurned,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving calories burned",
      error: error.message,
    });
  }
});

module.exports = router;
