const mongoose = require('mongoose');
const Model = require("../fields.model");
const LabelModel = require("../../labels/labels.model");
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');

const deleteFieldById = async ({id,orgId}) => {
    try {
        const fieldId = mongoose.Types.ObjectId(id);
        const fieldOrgId = mongoose.Types.ObjectId(orgId);

        console.log("fieldOrgId",fieldOrgId);

        const fieldUpdate = await Model.updateOne(
            { _id: fieldId, active: true ,orgId:fieldOrgId},
            { $set: { active: false } }
        );

        const labelUpdate = await LabelModel.updateMany(
            { fieldId, active: true, orgId:fieldOrgId},
            { $set: { active: false } }
        );

        if (fieldUpdate.nModified > 0 && labelUpdate.nModified > 0) {
            return { message: "Field and associated labels were successfully deactivated." };
        } else if (fieldUpdate.nModified > 0) {
            return { message: "Field was successfully deactivated, but no associated labels were found." };
        } else {
            throw ApiError(httpStatus.NOT_FOUND,"Field not found",false)
        }

    } catch (error) {
        return false;
    }
}

module.exports = deleteFieldById;
