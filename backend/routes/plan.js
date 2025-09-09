const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const Routine = require("../models/Routine");
const Set = require("../models/Set");
const Exercise = require("../models/Exercise");

// Create plan (originally POST /create-plan)
router.post("/create", async (req, res) => {
  const { plan } = req.body;

  try {
    const planEntry = await Plan.create({
      title: plan.title,
      description: plan.description,
      details: plan.details,
      image: plan.image,
    });

    for (const routine of plan.routines) {
      const routineEntry = await Routine.create({
        title: routine.title,
        routineableId: planEntry.id,
        routineableType: "Plan",
        isRest: routine.sets.length === 0,
      });

      for (const set of routine.sets) {
        await Set.create({
          exerciseId: set.exercise,
          routineId: routineEntry.id,
          count: set.set_count,
          value: set.target.value,
          unit: set.target.unit,
        });
      }
    }

    return res.status(200).json({ message: "Successfully created plan!" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating plan: " + error.message });
  }
});

// Edit plan (originally POST /edit-plan)
router.post("/edit", async (req, res) => {
  const { planId, details, description, image } = req.body;

  try {
    const plan = await Plan.findByPk(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found!" });

    plan.description = description;
    plan.details = details;
    plan.image = image;
    await plan.save();

    return res.status(200).json({ message: "Successfully edited plan!" });
  } catch (error) {
    return res.status(500).json({ message: "Error editing plan: " + error.message });
  }
});

// Get all plans (originally GET /plans)
router.get("/", async (req, res) => {
  try {
    const plans = await Plan.findAll();
    return res.status(200).json({ message: "Successfully retrieved plans", plans });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving plans: " + error.message });
  }
});

// Get plan by ID (originally GET /plan/:id)
router.get("/:id", async (req, res) => {
  const planId = req.params.id;

  try {
    const plan = await Plan.findByPk(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found!" });

    return res.status(200).json({ message: "Successfully retrieved plan", plan });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving plan: " + error.message });
  }
});

// Get routines in a plan (originally GET /plan-routines/:id)
router.get("/routines/:id", async (req, res) => {
  const planId = req.params.id;

  try {
    const plan = await Plan.findOne({
      where: { id: planId },
      include: {
        model: Routine,
        as: "routines",
        include: { model: Set, as: "sets" },
      },
    });

    if (!plan) return res.status(404).json({ message: "Plan not found!" });

    return res.status(200).json({ message: "Successfully retrieved routines", routines: plan.routines });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving routines: " + error.message });
  }
});

// Get sets in a routine (originally GET /routine-sets/:id)
router.get("/sets/:id", async (req, res) => {
  const routineId = req.params.id;

  try {
    const sets = await Set.findAll({
      where: { routineId },
      include: { model: Exercise, as: "exercise" },
    });

    if (!sets.length) return res.status(404).json({ message: "No sets found for this routine" });

    return res.status(200).json({ message: "Successfully retrieved sets", sets });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving sets: " + error.message });
  }
});

// Create exercises (originally POST /create-exercises)
router.post("/exercises/create", async (req, res) => {
  const { exercises } = req.body;

  try {
    for (const exercise of exercises) {
      await Exercise.create({
        name: exercise.name,
        type: exercise.type,
        target: JSON.stringify(exercise.target),
        description: exercise.description,
        instruction: JSON.stringify(exercise.instruction),
        image: exercise.image,
        variantUnit: exercise.variantUnit,
      });
    }

    return res.status(200).json({ message: "Successfully created exercises" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating exercises: " + error.message });
  }
});

// Delete exercises (originally POST /delete-exercises)
router.post("/exercises/delete", async (req, res) => {
  try {
    await Exercise.truncate();
    return res.status(200).json({ message: "Successfully deleted all exercises" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting exercises: " + error.message });
  }
});

module.exports = router;
