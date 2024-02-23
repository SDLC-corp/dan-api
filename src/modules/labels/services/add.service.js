const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../labels.model")

async function add({ documentTypeId, label, fieldId, logicCodeId, isOverride, overrideCustomLogic, userId,oclCreatedBy,oclUpdatedBy,oclCreatedAt ,oclUpdatedAt,orgId }) {
    let findQuery = { active: true, documentTypeId, label, isOverride, logicCodeId, overrideCustomLogic,orgId }
    let present = await Model.findOne(findQuery)
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Label already exists", true, "error")

    let created = await Model.create({
        documentTypeId, label, fieldId, logicCodeId, isOverride, overrideCustomLogic, createdBy: userId, updatedBy: userId,
        orgId,
        oclCreatedBy,
        oclUpdatedBy,
        oclCreatedAt,
        oclUpdatedAt
    })
    return created
}

module.exports = add