const { DataTypes } = require('sequelize');
const Role = require('./role');
const Permission = require('./permission');

module.exports = (sequelize, Sequelize) => {
  const RolePermission = sequelize.define('RolePermissions', {
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    permissionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  });
  return RolePermission;
};
