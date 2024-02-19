const mongoose = require('mongoose');
const Model = require("../role.model");

const deleteRole = async ({ id }) => {
    try {
        
        const roleId = mongoose.Types.ObjectId(id);

        const roleDelete = await Model.updateOne({ _id: roleId, active: true },{ $set: { active: false } });

        return roleDelete

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = deleteRole