const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hello oips" });
});

app.get("/protected", auth, (req, res) => {
  res.json({ message: "this is a protected route" });
});

// DB sync and server start
sequelize.sync().then(() => {
  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(
      `Server running on port ${process.env.PORT}`
    );
  });
});
