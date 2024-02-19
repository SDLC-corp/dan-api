const mongoose = require('mongoose');
const Model = require("../isoCodes.model");

const deleteContainerISOCode = async (id) => {
    try {
        const codeId = mongoose.Types.ObjectId(id);

        const fieldUpdate = await Model.updateOne(
            { _id: codeId, active: true },
            { $set: { active: false } }
        );
        
        if (fieldUpdate.nModified ) {
            return { message: "Container ISO Code Deleted Successfully ." };
        } else {
            return { message: "Container ISO Code not found" };
        }

    } catch (error) {
        return false;
    }
}

module.exports = deleteContainerISOCode;
