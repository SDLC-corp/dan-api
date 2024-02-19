const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fieldGroups.model")
const Mongoose  = require("mongoose")

async function getFiledGroup(id) {
    console.log('id',id);
    let findQuery = { active: true, _id : Mongoose.Types.ObjectId(id)}
    let present = await Model.findOne(findQuery)
    console.log('present',present);
    if (!present) throw new ApiError(httpStatus.OK, "Field Group Not exist", false, "error")
    return present
}

module.exports = getFiledGroup