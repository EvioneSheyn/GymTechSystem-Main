const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const auth = require("./middleware/auth");
require("./models/_Relationship");
const jwt = require("jsonwebtoken");

dotenv.config();

const PORT = 3030;
const SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hello oips" });
});

app.post("/validate", (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET); // throws if invalid or expired
    return res.status(200).json({ valid: true, expired: false, decoded });
  } catch (err) {
    return res.status(401).json({
      valid: false,
      expired: err.name === "TokenExpiredError",
      decoded: null,
      message: err.name + ": " + err.message,
    });
  }
});

// DB sync and server start
sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Sync error", err));
