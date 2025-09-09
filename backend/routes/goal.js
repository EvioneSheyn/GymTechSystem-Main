const express = require("express");
const { Op } = require("sequelize");
const auth = require("../middleware/auth");
const Goal = require("../models/Goal");
const router = express.Router();

router.get("/");

module.exports = router;
