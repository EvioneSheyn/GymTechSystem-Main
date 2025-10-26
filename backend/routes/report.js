const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const WorkoutSession = require("../models/WorkoutSession");
const Meal = require("../models/Meal");
const MealFood = require("../models/MealFood");
const WeightRecord = require("../models/WeightRecord");
const { subDays, eachDayOfInterval, startOfDay } = require("date-fns");
const { fn, col, literal, Op } = require("sequelize");

// Calorie report (originally GET /calorie-report)
router.get("/calorie", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const today = new Date();
    const startDate = subDays(today, 4);
    const last5Days = eachDayOfInterval({ start: startDate, end: today });

    const datesOnly = last5Days.map(
      (d) => d.toLocaleDateString("en-CA") // format YYYY-MM-DD in local time
    );
    // Calories burned

    const burnedResult = await WorkoutSession.findAll({
      attributes: [
        [
          // Shift updatedAt by +02:00 before grouping by day
          literal(`DATE("WorkoutSession"."updatedAt", '+08:00')`),
          "day",
        ],
        [fn("SUM", col("caloriesBurned")), "totalCaloriesBurned"],
      ],
      where: {
        userId,
        // Filter on createdAt — keep in UTC or apply the same offset if you want local filtering
        createdAt: { [Op.gte]: startOfDay(startDate) },
      },
      group: [literal(`DATE("WorkoutSession"."updatedAt", '+08:00')`)],
      order: [[literal(`DATE("WorkoutSession"."updatedAt", '+08:00')`), "ASC"]],
      raw: true,
    });

    // Calories intake
    const mealsTaken = await MealFood.findAll({
      attributes: [
        [
          // Shift createdAt by +02:00 before extracting date
          literal(`DATE("Meal"."createdAt", '+08:00')`),
          "day",
        ],
        [fn("SUM", col("MealFood.totalCalories")), "totalCaloriesIntake"],
      ],
      include: [
        {
          model: Meal,
          as: "meal",
          attributes: [],
          where: {
            userId,
            // Still filter using UTC startDate — you can also apply '+02:00' if needed
            createdAt: { [Op.gte]: startOfDay(startDate) },
          },
        },
      ],
      group: [literal(`DATE("Meal"."createdAt", '+08:00')`)],
      order: [[literal(`DATE("Meal"."createdAt", '+08:00')`), "ASC"]],
      raw: true,
    });

    const formattedBurnedResult = burnedResult.reduce((acc, b) => {
      console.log("BDAY: " + JSON.stringify(b));
      acc[b.day] = b.totalCaloriesBurned;
      return acc;
    }, {});

    const formattedMealsTaken = mealsTaken.reduce((acc, m) => {
      acc[m.day] = m.totalCaloriesIntake;
      return acc;
    }, {});

    res.status(200).json({
      reportData: {
        last5Days: datesOnly,
        burnedResult: formattedBurnedResult,
        mealsTaken: formattedMealsTaken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving calorie report",
      error: error.message,
    });
  }
});

// Monthly workout sessions (originally GET /monthly-workout-sessions)
router.get("/monthly-workouts", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const results = await WorkoutSession.findAll({
      attributes: [
        "userId",
        [fn("strftime", "%m", col("createdAt")), "monthNumber"],
        [fn("strftime", "%Y", col("createdAt")), "year"],
        [fn("COUNT", col("id")), "total"],
      ],
      where: { userId },
      group: ["year", "monthNumber"],
      order: [
        [literal("year"), "ASC"],
        [literal("monthNumber"), "ASC"],
      ],
      raw: true,
    });

    const monthLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formatted = results.map((r) => ({
      label: monthLabels[parseInt(r.monthNumber, 10) - 1],
      value: parseInt(r.total, 10),
    }));

    return res.status(200).json({ reportData: formatted });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving monthly workouts",
      error: error.message,
    });
  }
});

// Weight records (originally GET /weights)
router.get("/weights", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const records = await WeightRecord.findAll({ where: { userId } });
    return res.status(200).json({ weights: records });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving weight records",
      error: error.message,
    });
  }
});

router.get("/weight-summary", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const firstWeight = await WeightRecord.findOne({
      where: { userId },
      order: [["createdAt", "ASC"]],
    });
    const lastWeight = await WeightRecord.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    // Handle case when no weight records exist
    if (!firstWeight || !lastWeight) {
      return res.status(200).json({
        from: null,
        current: null,
        difference: 0,
        status: "No data",
      });
    }

    // Calculate weight difference (positive = gained, negative = lost)
    const difference = lastWeight.weight - firstWeight.weight;
    
    // Determine status based on difference
    let status;
    if (difference > 0) {
      status = "Gained";
    } else if (difference < 0) {
      status = "Lost";
    } else {
      status = "No change";
    }

    return res.status(200).json({
      from: firstWeight,
      current: lastWeight,
      difference: difference, // Keep original sign: positive = gained, negative = lost
      status,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving weight summary: " + error.message,
    });
  }
});

router.get("/streak", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    // Get all workout sessions ordered by date (newest first)
    const sessions = await WorkoutSession.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: ["createdAt"],
      raw: true,
    });

    if (sessions.length === 0) {
      return res.status(200).json({
        streak: 0,
      });
    }

    // Calculate consecutive days from today backwards
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const workoutDates = new Set();
    sessions.forEach(session => {
      const sessionDate = new Date(session.createdAt);
      sessionDate.setHours(0, 0, 0, 0);
      workoutDates.add(sessionDate.getTime());
    });

    // Check consecutive days starting from today
    let currentDate = new Date(today);
    
    // If today has a workout, start counting from today
    // If not, start from yesterday (don't count today as day 0)
    if (!workoutDates.has(currentDate.getTime())) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Count consecutive days backwards
    while (workoutDates.has(currentDate.getTime())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return res.status(200).json({
      streak: streak,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving streak count: " + error.message,
    });
  }
});

module.exports = router;
