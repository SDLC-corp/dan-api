const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fieldGroups.model")
const mongoose = require("mongoose")

async function getFiledGroup({ id, orgId }) {
    let findQuery = { _id: mongoose.Types.ObjectId(id), active: true, orgId: mongoose.Types.ObjectId(orgId) }
    console.log(findQuery);
    let deleted = await Model.updateOne(findQuery, { $set: { active: false } })
    console.log(deleted);

    if (deleted.nModified === 0) throw new ApiError(httpStatus.OK, "Field Group Not Deleted", false, "error")
    return deleted
}

module.exports = getFiledGroup