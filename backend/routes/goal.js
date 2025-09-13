const express = require("express");
const { Op } = require("sequelize");
const auth = require("../middleware/auth");
const Goal = require("../models/Goal");
const WeightRecord = require("../models/WeightRecord");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const goals = await Goal.findAll({ where: { userId } });

    if (goals) {
      return res
        .status(200)
        .json({ message: "Successfully retrieved goals", goals });
    }

    return res.status(200).json({
      message: "No goals found.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "GET /goal/ error: " + error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const userId = req.user.userId;
  const { type, target } = req.body;

  try {
    let goal;
    const userWeightRecord = await WeightRecord.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    switch (type) {
      case "workout":
        goal = await Goal.create({
          type,
          target,
          unit: "session/s",
        });
        break;
      case "weight":
        goal = await Goal.create({
          type,
          target,
          unit: "kg",
          from: userWeightRecord.weight,
        });
        break;
      default:
        return res
          .status(500)
          .json({ message: "Custom goal is not yet supported!" });
    }

    return res
      .status(200)
      .json({ message: "Custom goal is not yet supported!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "POST /goal/ error: " + error.message });
  }
});

// Goal Progress
router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  const userId = req.user.userId;

  try {
    const goal = await Goal.findByPk(id);

    if (goal) {
      await goal.update({ progress });

      return res.status(200).json({
        message: "Goal progress recorded",
      });
    }

    return res.status(404).json({
      message: "Attempted to delete a goal which is not existing.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding goal progress: " + error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const goal = await Goal.findByPk(id);

    if (goal) {
      await goal.delete();

      return res.status(200).json({
        message: "Goal deleted successfully",
      });
    }

    return res.status(404).json({
      message: "Attempted to delete a goal which is not existing.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting goal: " + error.message });
  }
});

module.exports = router;
