const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../role.model")

async function add({name, description,disabledModules }) {
    let findQuery = { active: true, name, description}
    let present = await Model.findOne(findQuery)
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists", true, "error")
    let created = await Model.create({ name, description, disabledModules })
    return created
}

module.exports = add