const mongoose = require('mongoose');
const Model = require("../role.model");

const deleteRole = async ({ id ,orgId, role}) => {
    try {
        
        const roleId = mongoose.Types.ObjectId(id);
        const organizationId = mongoose.Types.ObjectId(orgId);

        const filterQuery = role ==='superAdmin'? { _id: roleId, active: true }:{ _id: roleId, active: true , orgId: organizationId}

        const roleDelete = await Model.updateOne(filterQuery,{ $set: { active: false } });

        return roleDelete

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = deleteRole