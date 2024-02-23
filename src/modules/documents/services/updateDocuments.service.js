const httpStatus = require("http-status")
const ApiError = require("../../../utils/ApiError")
const { checkDocumentAndOrderTypeInOTM } = require("../../../utils/otmApiHelper")
const Model = require("../documents.model")
const getPrediction = require("./getPrediction.service")
const mongo = require("mongoose")

async function update(data) {
    const docData = data.body

    let result = await Model.updateOne({_id:mongo.Types.ObjectId(data.id), orgId:mongo.Types.ObjectId(data.orgId)},{$set:{...docData, syncWithOtm: false}})
    if(result.nModified){
       let fetchData =  await Model.findById({_id:mongo.Types.ObjectId(data.id)})
       getPrediction(fetchData)
       return fetchData
   }else{
       return null
   }
    
}

module.exports = update