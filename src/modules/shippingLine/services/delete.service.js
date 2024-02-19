const mongoose = require('mongoose');
const Model = require("../shippingLine.model");
const LabelModel = require("../../labels/labels.model");

const deleteShippingLine = async (id) => {
    try {
        const shippingLineId = mongoose.Types.ObjectId(id);

        const fieldUpdate = await Model.updateOne(
            { _id: shippingLineId, active: true },
            { $set: { active: false } }
        );

        const labelUpdate = await LabelModel.updateMany(
            { shippingLineId, active: true },
            { $set: { active: false } }
        );
        
        if (fieldUpdate.nModified > 0 && labelUpdate.nModified > 0) {
            return { message: "ShippingLine and associated labels were successfully deactivated." };
        } else if (fieldUpdate.nModified > 0) {
            return { message: "ShippingLine was successfully deactivated, but no associated labels were found." };
        } else {
            return { message: "ShippingLine not found" };
        }

    } catch (error) {
        return false;
    }
}

module.exports = deleteShippingLine;
