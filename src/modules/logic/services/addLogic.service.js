const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../logic.model")
const mongoose = require('mongoose');

async function add({ name, shortCode, textArea, userId, dependency, orgId }) {
    let findQuery = { active: true, name, shortCode, textArea, orgId: mongoose.Types.ObjectId(orgId) }
    let present = await Model.findOne(findQuery)
    if (present) throw new ApiError(httpStatus.BAD_REQUEST, "Logic already exists", true, "error")
    textArea = textArea.split('&lt;').join('<');
    let created = await Model.create({ name, shortCode, textArea, dependency, createdBy: userId, updatedBy: userId, orgId })
    return created
}

module.exports = add