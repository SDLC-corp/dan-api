const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fieldGroups.model")
const mongoose  = require("mongoose")

async function add(data) {
    let findQuery = { active: true, name:data.name, orgId : mongoose.Types.ObjectId(data.orgId)}
    let present = await Model.findOne(findQuery)
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Field Group already exists", true, "error")
    let created = await Model.create({...data})
    return created
}

module.exports = add