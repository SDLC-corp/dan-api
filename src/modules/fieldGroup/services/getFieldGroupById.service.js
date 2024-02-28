const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fieldGroups.model")
const mongoose  = require("mongoose")

async function getFiledGroup({id,orgId}) {
    
    let findQuery = { active: true, _id : mongoose.Types.ObjectId(id), orgId: mongoose.Types.ObjectId(orgId)}
    let present = await Model.findOne(findQuery)

    if (!present) throw new ApiError(httpStatus.OK, "Field Group Not exist", false, "error")
    return present
}

module.exports = getFiledGroup