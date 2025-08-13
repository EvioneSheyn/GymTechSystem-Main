const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");
const Plan = require("../models/Plan");
const Routine = require("../models/Routine");
const Set = require("../models/Set");

router.get("/", async (req, res) => {
  res.json({ message: "Connected!" });
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

    res.status(200).json({
      message: "Successful!",
    });
  } catch (err) {
    res.status(500).getHeaderNames({
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

    res.status(200).json({ message: "Succesfully edited plan!" });
  } catch (error) {
    res.status(500).json({
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

    plan.routines.forEach(async (routine) => {
      let routineEntry = await Routine.create({
        title: routine.title,
        routineableId: planEntry.id,
        routineableType: "Plan",
        isRest: routine.sets.length === 0 ? true : false,
      });
      console.log("created routine");

      if (routine.sets.length > 0) {
        routine.sets.forEach(async (set) => {
          await Set.create({
            exerciseId: set.exercise,
            routineId: routineEntry.id,
            count: set.set_count,
            value: set.target.value,
            type: set.target.unit,
          });
          console.log("created set");
        });
      }
    });

    res.status(200).json({ message: "Successfully created plan!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error when creating a routine" + error });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.findAll();

    res.status(200).json({
      message: "Successfully retrieved all plans!",
      plans: plans,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when retrieving plans!",
    });
  }
});

router.get("/plan/:id", async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await Plan.findOne({ where: { id: planId } });

    if (plan) {
      res.status(200).json({
        message: "Successfully retrieved plan",
        plan: plan,
      });
    } else {
      res.status(404).json({
        message: "Plan not found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when retrieving plan!",
    });
  }
});

router.post("/delete-exercises", async (req, res) => {
  try {
    await Exercise.truncate();
    res
      .status(200)
      .json({ nessage: "Successfully deleted all exercises!" });
  } catch (error) {
    res.status(500).json({
      nessage: "Something went wrong when deleting exercises!",
    });
  }
});

module.exports = router;
