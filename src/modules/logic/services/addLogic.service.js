const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../logic.model")

async function add({ name, shortCode, textArea, userId,dependency }) {
    let findQuery = { active: true, name, shortCode, textArea }
    let present = await Model.findOne(findQuery)
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Logic already exists", true, "error")
    textArea = textArea.split('&lt;').join('<');
    let created = await Model.create({ name, shortCode, textArea, dependency, createdBy: userId, updatedBy: userId })
    return created
}

module.exports = add