const roles = ['user', 'admin', 'superAdmin','documentation'];
const adminRoles = ['admin']; //only this roles can login to dashboard

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers']);
roleRights.set(roles[1], ['getUsers', 'adminAccess', 'manageFields',"manageUsers"]);
roleRights.set(roles[2], ['getUsers', 'adminAccess','manageUsers', 'manageFields',"update-password"]);
roleRights.set(roles[3], ['getUsers', 'adminAccess','manageUsers']);

module.exports = {
  roles,
  roleRights,
  adminRoles,

};
