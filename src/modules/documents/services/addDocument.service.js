const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../documents.model")
const getPrediction = require("./getPrediction.service")

async function add(data) {
    
    let created = await Model.create(data)
    if(created){
        await getPrediction(created)
    } else {
        throw new ApiError(httpStatus.BAD_GATEWAY, "Something went wrong", false)
    }
}

module.exports = add