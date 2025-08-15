const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const auth = require("./middleware/auth");
require("./models/_Relationship");

dotenv.config();

const PORT = process.env.PORT;
const SECRET = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hello oips" });
});

app.get("/validate", auth, (req, res) => {
  try {
    const decoded = jwt.verify(token, SECRET); // throws if invalid or expired
    return { valid: true, expired: false, decoded };
  } catch (err) {
    return {
      valid: false,
      expired: err.name === "TokenExpiredError",
      decoded: null,
    };
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
