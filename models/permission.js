const { DataTypes } = require('sequelize');
const RolePermission = require('./rolepermission');
const Role = require('./role');

module.exports = (sequelize, Sequelize) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Permission.associate = (models) => {
    Permission.belongsTo(models.Role, { through: models.RolePermission, foreignKey: 'permissionId' });
  };
  return Permission;
};
