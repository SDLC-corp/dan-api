const mongoose = require('mongoose');
const Model = require("../role.model");
const USER_MODEL = require('../../user/user.model');
const deleteRole = async ({ id, orgId, role }) => {
    try {
        const roleId = mongoose.Types.ObjectId(id);
        const organizationId = mongoose.Types.ObjectId(orgId);

        const filterQuery = role === 'superAdmin' ? { _id: roleId, active: true } : { _id: roleId, active: true, orgId: organizationId }

        const userWithRoleId = await USER_MODEL.find({ roleId: roleId })

        if (userWithRoleId.length > 0) {
            return { data: "Deletion Failed: This role is currently assigned to a user. Please reassign or remove the user from this role before attempting to delete it.", status: false, code: 404 }
        }
        const roleDelete = await Model.updateOne(filterQuery, { $set: { active: false } });
        if (roleDelete) {
            return { data: roleDelete, status: true, code: 200 };
        } else {
            return { data: "Role not found", status: false, code: 404 }
        }

    } catch (error) {
        console.log("Error", error);
        return { data: "Something Went Wrong!", status: false, code: 404 }
    }
}
module.exports = deleteRole