const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fieldGroups.model")
const mongoose  = require("mongoose")

async function getFiledGroup(id) {
    let findQuery = {_id : mongoose.Types.ObjectId(id), active : true}
    let deleted = await Model.updateOne(findQuery,{ $set:{ active : false}})
    if (deleted.nModified === 0) throw new ApiError(httpStatus.OK, "Field Group Not Deleted", false, "error")
    return deleted
}

module.exports = getFiledGroup