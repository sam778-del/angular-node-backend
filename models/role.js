'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Role.belongsTo(models.User, {
      //   foreignKey: 'id',
      //   as: 'user'
      // });
      
      // models.Permission.hasMany(Role, {
      //   through: 'RolePermission',
      //   as: 'permissions',
      //   foreignKey: 'roleId'
      // });
      // Role.belongsToMany(models.User, { foreignKey: 'role_id' });
      // Role.belongsToMany(models.User, { through: 'User_Roles' });
    }
  }
  Role.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};