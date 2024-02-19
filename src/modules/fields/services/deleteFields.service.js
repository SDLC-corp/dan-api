const mongoose = require('mongoose');
const Model = require("../fields.model");
const LabelModel = require("../../labels/labels.model");

const deleteFieldById = async (id) => {
    try {
        const fieldId = mongoose.Types.ObjectId(id);

        const fieldUpdate = await Model.updateOne(
            { _id: fieldId, active: true },
            { $set: { active: false } }
        );

        const labelUpdate = await LabelModel.updateMany(
            { fieldId, active: true },
            { $set: { active: false } }
        );

        if (fieldUpdate.nModified > 0 && labelUpdate.nModified > 0) {
            return { message: "Field and associated labels were successfully deactivated." };
        } else if (fieldUpdate.nModified > 0) {
            return { message: "Field was successfully deactivated, but no associated labels were found." };
        } else {
            return { message: "Field not found " };
        }

    } catch (error) {
        return false;
    }
}

module.exports = deleteFieldById;
