const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");
const Plan = require("../models/Plan");
const Routine = require("../models/Routine");
const Set = require("../models/Set");
const WorkoutSession = require("../models/WorkoutSession");
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");
const { body, validationResult } = require("express-validator");
const Food = require("../models/Food");
const Meal = require("../models/Meal");
const MealFood = require("../models/MealFood");
const { Op } = require("sequelize");
const { startOfDay, endOfDay } = require("date-fns");
const WeightRecord = require("../models/WeightRecord");

router.get("/", async (req, res) => {
  return res.json({ message: "Connected!" });
});

router.post("/finish-exercise", auth, async (req, res) => {
  const { routineId, caloriesBurned, duration } = req.body;
  const userId = req.user.userId;

  try {
    console.log(userId, routineId, caloriesBurned, duration);
    const session = await WorkoutSession.create({
      userId: userId,
      routineId: routineId,
      caloriesBurned: caloriesBurned,
      duration: duration,
    });

    return res
      .status(200)
      .json({ message: "Workout recording complete!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong: {" + error.message });
  }
});

router.post(
  "/create-profile",
  auth,
  [
    body("dateOfBirth")
      .isISO8601()
      .withMessage("Date of birth must be a valid date (YYYY-MM-DD)"),
    body("height")
      .isFloat({ min: 50, max: 300 })
      .withMessage("Height must be between 50cm and 300cm"),
    body("weight")
      .isFloat({ min: 20, max: 500 })
      .withMessage("Weight must be between 20kg and 500kg"),
    body("gender")
      .isIn(["Male", "Female"])
      .withMessage("Gender must be Male or Female"),
  ],
  async (req, res) => {
    const { dateOfBirth, height, weight, gender } = req.body;
    const userId = req.user.userId;
    const errors = validationResult(req);

    const today = new Date().toISOString().split("T")[0];

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userProfile = await Profile.findOne({
        where: {
          userId: userId,
        },
      });

      if (userProfile) {
        return res.status(400).json({
          message: "Profile already exists for this user!",
        });
      }

      console.log("No profile found, creating..");

      const profile = await Profile.create({
        userId: userId,
        dateOfBirth: dateOfBirth,
        height: height,
        gender: gender,
        weight: weight,
      });

      await WeightRecord.create({
        userId: userId,
        weight: weight,
        date: today,
      });

      return res.status(200).json({
        message: "Profile created successfully!",
        profile: profile,
      });
    } catch (error) {
      return res.status(500).json({
        message:
          "Something went wrong when creating profile: " +
          error.message,
      });
    }
  }
);

router.get("/profile", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    console.log(userId);
    const userProfile = await Profile.findOne({
      where: {
        userId: userId,
      },
    });

    if (!userProfile) {
      return res.status(404).json({
        message: "User profile not found!",
      });
    }

    const dob = new Date(userProfile.dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const age = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));

    const profile = {
      ...userProfile,
      age: age,
    };

    return res.status(200).json({
      profile: profile,
      message: "Succesfully retrieved user profile!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong: {" + error });
  }
});

router.post(
  "/update-weight",
  auth,
  [
    body("newWeight")
      .isFloat({ min: 20, max: 500 })
      .withMessage("Weight must be between 20kg and 500kg"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { newWeight } = req.body;
    const userId = req.user.userId;
    const today = new Date().toISOString().split("T")[0];

    try {
      await Profile.update(
        { weight: newWeight },
        { where: { userId: userId } }
      );

      const weightRecord = await WeightRecord.findOne({
        where: {
          userId: userId,
          date: today,
        },
      });

      if (!weightRecord)
        await WeightRecord.create({
          userId: userId,
          weight: newWeight,
          date: today,
        });
      else
        await WeightRecord.update(
          { weight: newWeight },
          { where: { id: weightRecord.id } }
        );

      return res.status(200).json({
        message: "Succesfully updated user weight!",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong: {" + error });
    }
  }
);

router.post("/create-exercises", async (req, res) => {
  const { exercises } = req.body;
  // name, type, target, description, instruction, image, video.

  try {
    exercises.forEach((exercise) => {
      Exercise.create({
        name: exercise.name,
        type: exercise.type,
        target: JSON.stringify(exercise.target),
        description: exercise.description,
        instruction: JSON.stringify(exercise.instruction),
        image: exercise.image,
        variantUnit: exercise.variantUnit,
      });
    });

    return res.status(200).json({
      message: "Successful!",
    });
  } catch (err) {
    return res.status(500).getHeaderNames({
      message: "Exercise uploading failed:",
      error: err.message,
    });
  }
});

router.post("/edit-plan", async (req, res) => {
  const { planId, details, description, image } = req.body;

  try {
    let plan = await Plan.findOne({ where: { id: planId } });
    plan.description = description;
    plan.details = details;
    plan.image = image;
    await plan.save();

    return res
      .status(200)
      .json({ message: "Succesfully edited plan!" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when editing plan: " + error,
    });
  }
});

router.post("/create-plan", async (req, res) => {
  const { plan } = req.body;

  try {
    let planEntry = await Plan.create({
      title: plan.title,
      description: plan.description,
      details: plan.details,
      image: plan.image,
    });

    console.log("created plan");

    for (const routine of plan.routines) {
      let routineEntry = await Routine.create({
        title: routine.title,
        routineableId: planEntry.id,
        routineableType: "Plan",
        isRest: routine.sets.length === 0 ? true : false,
      });
      console.log("created routine");

      if (routine.sets.length > 0) {
        for (const set of routine.sets) {
          try {
            await Set.create({
              exerciseId: set.exercise,
              routineId: routineEntry.id,
              count: set.set_count,
              value: set.target.value,
              unit: set.target.unit,
            });
            console.log("created set");
          } catch (error) {
            return res
              .status(500)
              .json({ message: "Error when creating Set: " + error });
          }
        }
      }
    }

    return res
      .status(200)
      .json({ message: "Successfully created plan!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error when creating a routine" + error });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.findAll();

    return res.status(200).json({
      message: "Successfully retrieved all plans!",
      plans: plans,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving plans!",
    });
  }
});

router.get("/plan/:id", async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await Plan.findOne({ where: { id: planId } });

    if (plan) {
      return res.status(200).json({
        message: "Successfully retrieved plan",
        plan: plan,
      });
    } else {
      return res.status(404).json({
        message: "Plan not found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving plan!",
    });
  }
});

router.get("/plan-routines/:id", async (req, res) => {
  try {
    const planId = req.params.id;

    const plan = await Plan.findOne({
      where: { id: planId },
      include: {
        model: Routine,
        as: "routines",
        include: {
          model: Set,
          as: "sets",
        },
      },
    });

    console.log(plan);

    if (plan) {
      return res.status(200).json({
        message: "Successfully retrieved plan",
        routines: plan.routines,
      });
    } else {
      return res.status(404).json({
        message: "Plan not found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving plan routines!",
      error: error,
    });
  }
});

router.get("/routine-sets/:id", async (req, res) => {
  try {
    const routineId = req.params.id;

    const sets = await Set.findAll({
      where: { routineId: routineId },
      include: {
        model: Exercise,
        as: "exercise",
      },
    });

    if (sets) {
      return res.status(200).json({
        message: "Successfully retrieved routine sets!",
        sets: sets,
      });
    } else {
      return res.status(404).json({
        message: "No set records found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong when retrieving routine sets! " +
        error.message,
    });
  }
});

router.post("/delete-exercises", async (req, res) => {
  try {
    await Exercise.truncate();
    res
      .status(200)
      .json({ message: "Successfully deleted all exercises!" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when deleting exercises!",
    });
  }
});

router.post("/add-foods", async (req, res) => {
  const { foods } = req.body;
  try {
    Food.bulkCreate(foods);

    return res.status(200).json({
      message: "Successfully added foods",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong when adding foods: " + error.message,
    });
  }
});

router.get("/foods", async (req, res) => {
  try {
    const foods = await Food.findAll();

    return res.status(200).json({
      message: "Successfully retrieved foods!",
      foods: foods,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving foods!",
      error: error,
    });
  }
});

router.post("/add-meal", auth, async (req, res) => {
  const { foodId, quantity, mealType } = req.body;
  const userId = req.user.userId;
  try {
    const today = new Date().toISOString().split("T")[0];

    let meal = await Meal.findOne({
      where: { userId, mealType, date: today },
    });

    if (!meal) {
      meal = await Meal.create({ userId, mealType, date: today });
    }

    const food = await Food.findOne({ where: { id: foodId } });

    console.log("Food: ", food);

    const mealFood = await MealFood.create({
      mealId: meal.id,
      foodId,
      quantity,
      totalCalories: food.calories * quantity,
    });

    return res.status(200).json({
      message: "Successfully added food to meal!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong when retrieving foods!",
      error: error.message,
    });
  }
});

router.post("/meal", auth, async (req, res) => {
  const { mealType } = req.body;
  const userId = req.user.userId;
  try {
    const today = new Date().toISOString().split("T")[0];

    let meal = await Meal.findOne({
      where: { userId, mealType, date: today },
    });

    console.log("Meal: ", meal);

    if (!meal) {
      return res.status(404).json({
        message: "No meal yet!",
      });
    }

    const foods = await MealFood.findAll({
      where: { mealId: meal.id },
      include: {
        model: Food,
        as: "food",
      },
    });

    return res.status(200).json({
      message: "Successfully retrieved food from meal!",
      foods: foods,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong when retrieving foods!" + error.message,
    });
  }
});

router.post("/total-meal", auth, async (req, res) => {
  const userId = req.user.userId;
  const { date } = req.body;
  try {
    let meals = await Meal.findAll({
      where: { userId, date: date },
      include: {
        model: MealFood,
        as: "mealFoods",
        include: {
          model: Food,
          as: "food",
        },
      },
    });

    let totalCalories = 0;

    meals.forEach((meal) => {
      meal.mealFoods.forEach((mealFood) => {
        totalCalories += Number(mealFood.totalCalories) || 0;
      });
    });

    return res.status(200).json({
      message: "Successfully retrieved food from meal!",
      meals: meals,
      totalCalories: totalCalories,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong when retrieving foods!" + error.message,
    });
  }
});

router.get("/all-workout-sessions", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const sessions = await WorkoutSession.findAll({
      where: { userId: userId },
    });

    return res.status(200).json({
      message: "Succesfully retrieved workout sessions",
      sessions: sessions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong: {" + error.message });
  }
});

router.post("/workout-sessions", auth, async (req, res) => {
  const userId = req.user.userId;
  const { date } = req.body;

  try {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const workoutSessions = await WorkoutSession.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    });

    let totalCaloriesBurned = 0;

    workoutSessions.forEach((item) => {
      totalCaloriesBurned += Number(item.caloriesBurned) || 0;
    });

    return res.status(200).json({
      message: "Successfully retrieved calories-burned record!",
      sessions: workoutSessions,
      caloriesBurned: totalCaloriesBurned,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Something went wrong when retrieving calories burned!" +
        error.message,
    });
  }
});

module.exports = router;
