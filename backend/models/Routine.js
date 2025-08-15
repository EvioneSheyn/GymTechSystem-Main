const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Routine = sequelize.define("Routine", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  routineableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  routineableType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isRest: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Routine;
