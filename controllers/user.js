const fbgraph = require('fbgraph');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { secret } = require('../config');
const models = require('../models');
const User = models.users;
const Role = models.roles;
const Permission = models.permissions;
const RolePermission = models.role_permissions;

const authenticateFacebook = async (req, res) => {
    try {
        const accessToken = req.body.accessToken;

        // validate access token with Facebook
        const facebookUser = await new Promise((resolve, reject) => {
            fbgraph.setAccessToken(accessToken);
            fbgraph.get('me?fields=id,email,first_name,last_name', (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        // create or update user record in database
        let user = await User.findOne({
            where: {
                facebookId: facebookUser.id
            }
        });

        if (!user) {
            user = await User.create({
                email: facebookUser.email,
                name: facebookUser.first_name + ' ' + facebookUser.last_name,
                facebookId: facebookUser.id,
                role: 'user' // assign default role of 'user'
            });
        }

        // generate JWT token for user
        const token = jwt.sign({ userId: user.id }, secret);

        // send response with JWT token
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid access token' });
    }
}

const validateAccesstoken = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];

    try {
        const decoded = await jwt.verify(accessToken, secret);
        res.json({ valid: true, decoded });
    } catch (error) {
        res.status(401).json({ valid: false, error: 'Invalid access token' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }

        const users = await User.findAll({
            attributes: ['id', 'email', 'name', 'role']
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const createUser = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }

        const { email, password, name, role = 'user' } = req.body;

        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user record in the database
        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            role
        });

        // Send response with JWT access token
        res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }

        const roles = await Role.findAll();
        res.status(200).json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllPermissions = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }

        const permissions = await Permission.findAll();
        res.status(200).json(permissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


const updatePermissionForRole = async (req, res) => {

    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }

        const { roleId, permissionIds } = req.body;

        // Find the role permissions
        const rolePermissions = await RolePermission.findAll({
            where: { roleId },
            include: [{ model: Permission }]
        });

        // Extract the current permission IDs from the role permissions
        const currentPermissionIds = rolePermissions.map(rolePermission => rolePermission.permission.id);

        // Calculate the IDs of the permissions to remove and add
        const permissionsToRemove = currentPermissionIds.filter(id => !permissionIds.includes(id));
        const permissionsToAdd = permissionIds.filter(id => !currentPermissionIds.includes(id));

        // Remove the permissions to remove from the role
        if (permissionsToRemove.length > 0) {
            await RolePermission.destroy({
                where: { roleId, permissionId: permissionsToRemove }
            });
        }

        // Add the permissions to add to the role
        if (permissionsToAdd.length > 0) {
            const newRolePermissions = permissionsToAdd.map(permissionId => ({ roleId, permissionId }));
            await RolePermission.bulkCreate(newRolePermissions);
        }

        res.status(200).json({ message: 'Permissions updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllPermissionsForUserRole = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }
        const token = authorizationHeader.split(' ')[1];
        const decodedToken = await jwt.verify(token, secret);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid authorization token' });
        }

        const userId = req.user.id;
        const user = await User.findOne({
            where: { id: userId },
            include: { model: Role, include: { model: Permission } }
        });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const role = user.Role;
        const permissions = role.Permissions.map(permission => permission.name);
        res.json({ permissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getActivePermission = async (req, res) => {
    try {
        const roleId = req.params.roleId;
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        const rolePermissions = await RolePermission.findAll({
            where: { roleId },
            include: [{ model: Permission }]
        });

        const activePermissions = rolePermissions.filter(rolePermission => rolePermission.active)
            .map(rolePermission => rolePermission.Permission);

        res.json({ role: role.name, permissions: activePermissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    authenticateFacebook,
    validateAccesstoken,
    getAllUsers,
    createUser,
    getAllRoles,
    getAllPermissions,
    updatePermissionForRole,
    getAllPermissionsForUserRole,
    getActivePermission
};
