const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Role', {
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

  // Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
  Role.associate = (models) => {
    Role.belongsTo(models.Permission, { through: models.RolePermission, foreignKey: 'roleId' });
  };
  return Role;
};
