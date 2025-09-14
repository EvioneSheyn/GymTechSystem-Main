const express = require("express");
const router = express.Router();

router.use("/profile", require("./profile"));
router.use("/workout", require("./workout"));
router.use("/meal", require("./meal"));
router.use("/plans", require("./plan"));
router.use("/report", require("./report"));
router.use("/user", require("./user"));
router.use("/goal", require("./goal"));

module.exports = router;
