const mongoose = require('mongoose');
const Model = require("../role.model");

const deleteRole = async ({ id ,orgId}) => {
    try {
        
        const roleId = mongoose.Types.ObjectId(id);
        const organizationId = mongoose.Types.ObjectId(orgId);

        const roleDelete = await Model.updateOne({ _id: roleId, active: true , orgId: organizationId},{ $set: { active: false } });

        return roleDelete

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = deleteRole