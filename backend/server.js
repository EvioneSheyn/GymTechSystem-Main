const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hello oips" });
});

// DB sync and server start
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Server running on http://localhost:${process.env.PORT}`
    );
  });
});
