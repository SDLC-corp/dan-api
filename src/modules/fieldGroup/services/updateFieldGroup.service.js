const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fieldGroups.model")
const mongoose  = require("mongoose")

async function add({ objectId,data, updatedBy,orgId}) {
    console.log('updatedBy',updatedBy);
    let result = await Model.updateOne({_id:mongoose.Types.ObjectId(objectId)},{$set:{...data,updatedBy,orgId}})
    return result
}
module.exports = add