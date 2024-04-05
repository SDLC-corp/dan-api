const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../documents.model")
const getPrediction = require("./getPrediction.service")

async function add(data) {
    
    if (data?.documentNo) {
        const filterQuery = { documentNo: data.documentNo };
        const existingDocuments = await Model.find(filterQuery);
        if (existingDocuments.length > 0) {
            throw new ApiError(httpStatus.CONFLICT, "Document Number Already Present!", false);
        }
    }

    const existingDocCount = await Model.countDocuments({ orgId: data.orgId, active: true });
    console.log(existingDocCount);
    if (existingDocCount > 9) {
        throw new ApiError(httpStatus.FORBIDDEN, "Organization has reached the limit of free document uploads.", false);
    }
    let created = await Model.create(data)
    
    if (created) {
        await getPrediction(created)
    } else {
        throw new ApiError(httpStatus.BAD_GATEWAY, "Something went wrong", false)
    }
}

module.exports = add