const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profile = sequelize.define("Profile", {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM(["Male", "Female"]),
    allowNull: false,
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Profile;
