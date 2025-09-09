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

module.exports = router;
