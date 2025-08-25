const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WeightRecord = sequelize.define("WeightRecord", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = WeightRecord;
