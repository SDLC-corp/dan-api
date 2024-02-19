const mongoose = require('mongoose');
const Model = require("../logic.model");
const LabelModel = require('../../labels/labels.model')

const deleteLogic = async ({ id, userId }) => {
    try {
        
        const logicCodeId = mongoose.Types.ObjectId(id);

        const customLogicUpdate = await Model.updateOne(
            { _id: logicCodeId, active: true },
            { $set: { active: false } }
        );

        const labelUpdate = await LabelModel.updateMany({ logicCodeId, active: true }, {
            $set: { active: false, updatedBy: userId }
        })

        if (customLogicUpdate.nModified > 0 && labelUpdate.nModified > 0) {
            return { message: "Custom logic and associated labels were successfully deactivated." };
        } else if (customLogicUpdate.nModified > 0) {
            return { message: "Custom logic was successfully deactivated, but no associated labels were found." };
        } else {
            return { message: "Custom logic not found " };
        }

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = deleteLogic