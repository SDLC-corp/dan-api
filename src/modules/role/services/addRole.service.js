const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../role.model")
const mongoose = require("mongoose")

async function add({name, description,disabledModules, orgId }) {
    let findQuery = { active: true, name, description}
    let present = await Model.findOne(findQuery)
    orgId = mongoose.Types.ObjectId(orgId)
    
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists", true, "error")
    let created = await Model.create({ name, description, disabledModules, orgId })
    return created
}

module.exports = add