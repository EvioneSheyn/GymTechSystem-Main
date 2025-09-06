const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { Op } = require("sequelize");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findOne({
      where: { [Op.or]: [{ email: email }, { username: username }] },
    });

    if (existing)
      return res.status(400).json({ message: "User already exist" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      // ...(username && { username }),
      username,
      email,
      password: hashed,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "20h",
    });

    res.status(201).json({
      message: "User created",
      user: { id: user.id, username, email },
      token: token,
    });
  } catch (err) {
    res.status(500).getHeaderNames({
      message: "Registration failed:",
      error: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "No user with that email!" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({
        message: "Incorrect Password!",
      });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "20h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        verifiedAt: user.verifiedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
