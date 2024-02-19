const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const Model = require("../documents.model")
const getPrediction = require("./getPrediction.service")
const getInvoicePredictionService = require("./getInvoicePrediction.service")

async function add(data) {

    const { domainName, documentNo, bookingNo, documentType, stageType, shippingLineId,extractionType } = data 

    let created = await Model.create(data)
    if(created){
        if(extractionType == "invoice"){
            await getInvoicePredictionService(created)
        }else {
            await getPrediction(created)
        }
    } else {
        throw new ApiError(httpStatus.BAD_GATEWAY, "Something went wrong", false)
    }
}

module.exports = add