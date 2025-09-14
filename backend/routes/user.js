const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

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

router.patch("/change-password/:id", auth, async (req, res) => {
  const userId = req.user.userId;
  const {oldPassword, newPassword,confirmedNewPassword} = req.body;
  try {
    await User.findByPk(userId).delete();

    return res.status(200).json({
      message: "Succesfully changed your account password.",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error changing account password: ",
      error: err.message,
    });
  }
});

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
