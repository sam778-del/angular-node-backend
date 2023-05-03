'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User.belongsToMany(models.Role, { through: User_Roles });
    }
  };

  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    role_id: DataTypes.INTEGER,
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facebookId: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return User;
};