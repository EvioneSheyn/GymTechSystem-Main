const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");
const Plan = require("../models/Plan");
const Routine = require("../models/Routine");
const Set = require("../models/Set");

router.get("/", async (req, res) => {
  return res.json({ message: "Connected!" });
});

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
              type: set.target.unit,
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
      message: "Something went wrong when retrieving routine sets!",
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

module.exports = router;
