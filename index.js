const cors = require("cors");
const express = require('express');
const app = express();
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
const { authenticateFacebook, validateAccesstoken, getAllUsers, createUser, getAllPermissionsForUserRole, updatePermissionForRole, getAllPermissions, getAllRoles, getActivePermission } = require('./controllers/user');
app.use(express.json());
app.use(cors(corsOptions)) // Use this after the variable declaration

// Use the controller to handle endpoint data



// facebook login
app.post('/facebook/auth', authenticateFacebook);
app.get('/facebook/checkToken', validateAccesstoken)

// users section
app.get('/user/all', getAllUsers)
app.post('/user/create', createUser);
app.get('/roles', getAllRoles);
app.get('/permissions', getAllPermissions);
app.put('/roles/:roleId/permissions/:permissionId', updatePermissionForRole);
app.get('/permissions/user', getAllPermissionsForUserRole);
app.get('/roles/:roleId/permissions', getActivePermission);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('App running at ' + PORT);
});
