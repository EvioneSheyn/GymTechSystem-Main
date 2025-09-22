const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const User = require("../models/User");
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

router.delete("/:id", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    await User.findByPk(userId).delete();

    return res.status(200).json({
      message: "Succesfully delteted your account.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting account: ", error: err.message });
  }
});

module.exports = router;
