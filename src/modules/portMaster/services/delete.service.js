const mongoose = require('mongoose');
const Model = require("../portMaster.model");

const deletePortMaster = async (id) => {
    try {
        const portMasterId = mongoose.Types.ObjectId(id);
console.log('portMaster id',portMasterId);
        const fieldUpdate = await Model.updateOne(
            { _id: portMasterId, active: true },
            { $set: { active: false } }
        );
        if (fieldUpdate.nModified ) {
            return { message: "Port Master successfully deactivated." };
        } else {
            return { message: "Port Master not found" };
        }

    } catch (error) {
        return false;
    }
}

module.exports = deletePortMaster;
