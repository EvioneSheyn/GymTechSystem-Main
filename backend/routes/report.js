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
        [fn("date", col("Meal.createdAt")), "day"],
        [fn("SUM", col("MealFood.totalCalories")), "totalCaloriesIntake"],
      ],
      include: [
        {
          model: Meal,
          as: "meal",
          attributes: [],
          where: {
            userId,
            createdAt: { [Op.gte]: startOfDay(startDate) },
          },
        },
      ],
      group: [literal("day")],
      order: [[literal("day"), "ASC"]],
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

    const status = lastWeight.weight >= firstWeight.weight ? "Gains" : "Loss";
    const difference = lastWeight.weight - firstWeight.weight;

    return res.status(200).json({
      from: firstWeight,
      current: lastWeight,
      difference: status === "Loss" ? difference * -1 : difference,
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
    const result = await WorkoutSession.count({
      where: { userId },
    });

    return res.status(200).json({
      streak: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving streak count: " + error.message,
    });
  }
});

module.exports = router;
