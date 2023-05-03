class Helper {
    constructor() {}
  
    async checkPermission(roleId, permName) {
      try {
        const perm = await Permission.findOne({
          where: {
            name: permName,
          },
        });
  
        const rolePermission = await RolePermission.findOne({
          where: {
            roleId: roleId,
            permissionId: perm.id,
          },
        });
  
        if (rolePermission) {
          return rolePermission;
        } else {
          throw new Error('Forbidden');
        }
      } catch (error) {
        throw error;
      }
    }
  }
  
  module.exports = Helper;
  