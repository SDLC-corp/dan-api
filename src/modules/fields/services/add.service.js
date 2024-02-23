const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../fields.model")
const Mongoose  = require("mongoose")

async function add(data) {
    let findQuery = {paramName: data.paramName, displayName: data.displayName}
    let paramNameQuery = {paramName: data.paramName}
    let displayNameQuery = {displayName: data.displayName}
    let present = await Model.findOne(findQuery)
    let paramName = await Model.findOne(paramNameQuery)
    let displayName = await Model.findOne(displayNameQuery)
    if(present) throw new ApiError(httpStatus.BAD_REQUEST, "Param name and Display name pair already exists", true, "error")
    if(paramName) throw new ApiError(httpStatus.BAD_REQUEST, "Param name already exists", true, "error")
    if(displayName) throw new ApiError(httpStatus.BAD_REQUEST, "Display name already exists", true, "error")
    if (data.orgId) {
        data.orgId = Mongoose.Types.ObjectId(data.orgId) 
    }
    let {index} = await Model.findOne({orgId:data.orgId}).sort({index:-1})

    let groupId 
    if (data?.fieldGroupId?.trim()) {
        groupId = Mongoose.Types.ObjectId(data.fieldGroupId) 
    }else{
        groupId = null
    }
    let created = await Model.create({...data,fieldGroupId:groupId,index:Number(index+1)})
    return created
}

module.exports = add