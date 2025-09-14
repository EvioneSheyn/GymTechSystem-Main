const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const Profile = require("../models/Profile");
const WeightRecord = require("../models/WeightRecord");
const Goal = require("../models/Goal");
const { Op } = require("sequelize");

// Get profile (originally GET /profile)
router.get("/", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const userProfile = await Profile.findOne({ where: { userId } });
    if (!userProfile)
      return res.status(404).json({ message: "User profile not found!" });

    const dob = new Date(userProfile.dateOfBirth);
    const age = Math.floor(
      (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );

    return res.status(200).json({
      profile: { ...userProfile.toJSON(), age },
      message: "Successfully retrieved user profile!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// Create profile (originally POST /create-profile)
router.post(
  "/create",
  auth,
  [
    body("dateOfBirth").isISO8601(),
    body("height").isFloat({ min: 50, max: 300 }),
    body("weight").isFloat({ min: 20, max: 500 }),
    body("gender").isIn(["Male", "Female"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { dateOfBirth, height, weight, gender } = req.body;
    const userId = req.user.userId;
    const today = new Date().toISOString().split("T")[0];

    try {
      const existingProfile = await Profile.findOne({ where: { userId } });
      if (existingProfile)
        return res.status(400).json({ message: "Profile already exists!" });

      const profile = await Profile.create({
        userId,
        dateOfBirth,
        height,
        weight,
        gender,
      });
      await WeightRecord.create({ userId, weight, date: today });

      return res
        .status(200)
        .json({ message: "Profile created successfully!", profile });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error creating profile", error: error.message });
    }
  }
);

router.patch(
  "/",
  auth,
  [
    body("dateOfBirth").isISO8601(),
    body("height").isFloat({ min: 50, max: 300 }),
    body("gender").isIn(["Male", "Female"]),
  ],
  async (req, res) => {
    const userId = req.user.userId;
    const { gender, height, dateOfBirth } = req.body;

    try {
      const profile = await Profile.findOne({ where: { userId } });

      if (profile) {
        const updates = {};
        if (gender !== undefined) updates.gender = gender;
        if (height !== undefined) updates.height = height;
        if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth;

        await profile.update(updates);
      }
      return res
        .status(200)
        .json({ message: "Profile edited successfully!", profile });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error editing profile", error: error.message });
    }
  }
);

// Update weight (originally POST /update-weight)
router.post("/update-weight", auth, async (req, res) => {
  const { newWeight } = req.body;
  const userId = req.user.userId;
  const today = new Date().toISOString().split("T")[0];

  try {
    await Profile.update({ weight: newWeight }, { where: { userId } });

    let weightRecord = await WeightRecord.findOne({
      where: { userId, date: today },
    });

    if (!weightRecord) {
      weightRecord = await WeightRecord.create({
        userId,
        weight: newWeight,
        date: today,
      });
    } else {
      await WeightRecord.update(
        { weight: newWeight },
        { where: { id: weightRecord.id } }
      );
    }

    const userGoal = Goal.findOne({
      where: {
        [Op.and]: [{ userId }, { completed: false, type: "weight" }],
      },
    });

    if (userGoal) {
      const isBulking = userGoal.target > userGoal.from;
      const isRegressing = isBulking
        ? weightRecord.weight < userGoal.from
        : weightRecord.weight > userGoal.from;

      const calculatedFrom = isRegressing ? weightRecord.weight : userGoal.from;
      await userGoal.update({
        from: calculatedFrom,
        progress: !isRegressing ? weightRecord - calculatedFrom : 0,
        completed: isBulking
          ? weightRecord.weight >= userGoal.target
          : weightRecord.weight <= userGoal.target,
      });
    }

    return res
      .status(200)
      .json({ message: "Successfully updated user weight!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong: " + error.message });
  }
});

module.exports = router;
