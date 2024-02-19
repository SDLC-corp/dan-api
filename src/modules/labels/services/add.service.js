const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../labels.model")

async function add({ documentTypeId, label, fieldId, logicCodeId, isOverride, overrideCustomLogic, userId,oclCreatedBy,oclUpdatedBy,oclCreatedAt ,oclUpdatedAt }) {
    let findQuery = { active: true, documentTypeId, label, isOverride, logicCodeId, overrideCustomLogic }
    let present = await Model.findOne(findQuery)
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Label already exists", true, "error")
    console.log('userId', userId);
    let created = await Model.create({
        documentTypeId, label, fieldId, logicCodeId, isOverride, overrideCustomLogic, createdBy: userId, updatedBy: userId,
        oclCreatedBy,
        oclUpdatedBy,
        oclCreatedAt,
        oclUpdatedAt
    })
    return created
}

module.exports = add