const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const Model = require("../organizations.model")
const mongoose = require('mongoose');

async function update({ syncApiUrl, orgId }) {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(orgId) }
    let update = await Model.findOneAndUpdate(filterQuery, { syncApiUrl})
    if (update) {
        return update
    } else {
        throw ApiError(httpStatus.NOT_FOUND, "Organization not found", false)
    }
}

module.exports = update