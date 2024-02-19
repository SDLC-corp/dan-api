const mongoose = require('mongoose');
const Model = require('../documents.model');
const FieldModel = require("../../fields/fields.model");
const LabelsModel = require("../../labels/labels.model");
const LogicModal = require('../../logic/logic.model')
const ContainerISOModal = require('../../containerIsoCode/isoCodes.model')
const ShippingModel = require("../../shippingLine/shippingLine.model");
var safeEval = require('safe-eval');
const getAllPortMaster = require('../../portMaster/services/service.getAllPortMaster');
const { getCountryCodeByAddress, getContainerListAPI } = require('../../../utils/otmApiHelper');
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');

async function processExtractedFields(documentId, clearOverrideValues) {

   
    const document = await Model.findById(documentId)
    let orderType = document.orderType
    let domainName = document.domainName
    let documentNo = document.documentNo
    // transportHandlingUnitGid

    // if (userData.role == "documentation" && (userData._id?.toString() != document?.assignTo?.toString())) {
    //     throw new ApiError(httpStatus.UNAUTHORIZED, "You do not have authorization to access this document", {}, "")
    // }

    const shippingLineDetails = await ShippingModel.findById(mongoose.Types.ObjectId(document.shippingLineId));

    const portMasterArr = await getAllPortMaster(shippingLineDetails.type)

    const aggregateQuery = [
        {
            "$match": { active: true, shippingLineId: mongoose.Types.ObjectId(document.shippingLineId) }
        },
        {
            "$lookup": {
                "from": "fields",
                "localField": "fieldId",
                "foreignField": "_id",
                "as": "field"
            }
        },
        {
            "$unwind": {
                "path": "$field",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup": {
                "from": "logics",
                "localField": "logicCodeId",
                "foreignField": "_id",
                "as": "logic"
            }
        },
        {
            "$unwind": {
                "path": "$logic",
                "preserveNullAndEmptyArrays": true
            }
        } , {
            $project: {
                shippingLineId: 1,
                label: 1,
                isOverride: 1,
                overrideCustomLogic: 1,
                "field.displayName": 1,
                "field._id" : 1,
                "field.index": 1,
                "field.paramName": 1,
                "field.paramName": 1,
                "field.fieldType": 1,
                "field.master": 1,
                "field.dateFormat": 1,
                "logic.name": 1,
                "logic.shortCode": 1,
                "logic.textArea": 1,
            },
        }
    ]
    const labels = await LabelsModel.aggregate(aggregateQuery).sort({ "field.index": 1 });
    const confidenceLogic = await LogicModal.findOne({shortCode:'EXTRACT_CONFIDENCE'})
    const containerCodes = await ContainerISOModal.find({active:true})
    let fieldsAndValues = [];
    let master_container_type = containerCodes?.map(item=>({text :item.text,code:item.code}))

    // reverting for temp as not able to fetch
    // let otmContainerList = await getContainerListAPI({ orderType, domainName, documentNo });
    // let arr = otmContainerList?.map(item => ({ text: item.transportHandlingUnitGid, code: item.transportHandlingUnitGid }));

    for (let i = 0; i < labels.length; i++) {
        const aLabel = labels[i];
        let fieldName = aLabel.field.paramName
        let displayName = aLabel.label
        let fieldType = aLabel.field.fieldType
        let isCountryCodeField = false

        if(fieldType == "master") {
            isCountryCodeField = aLabel.field?.master.collectionName == "countryCode"
        }

        var context = {
            document: document,
            thisField: aLabel,
            fieldName:fieldName,
            portMasterArr: portMasterArr,
            allFields: labels,
            master_container_type: master_container_type,
            shippingLineDetails: shippingLineDetails,
            log: function (...str) { console.log(...str) }
        }

        

        let fieldValue, confidence;
        try {
            if (aLabel.isOverride){
                fieldValue = safeEval(aLabel.overrideCustomLogic, context)
            }else{
                fieldValue = safeEval(aLabel.logic.textArea, context)
            }
            confidence = safeEval(confidenceLogic.textArea, context)
        } catch (error) {
            console.log(fieldName, " : Error : ", error)
        }

        let overrideValue;

        if (!clearOverrideValues && document.fieldsAndValues && document.fieldsAndValues.length > 0){
            for (let t = 0; t < document.fieldsAndValues.length; t++) {
                const aFnV = document.fieldsAndValues[t];
                if (aFnV.fieldName == fieldName && aFnV.overrideValue){
                    overrideValue = aFnV.overrideValue
                }
            }
        }

        if(isCountryCodeField){
            // console.log("--------------------------- Found country_code---------------------------",
            //  fieldType, fieldName, fieldValue);
            if(fieldValue){
                try {
                    fieldValue = await getCountryCodeByAddress(fieldValue)
                } catch (error) {
                    fieldValue = ""
                }
            } 
        }

        if (fieldType === "table") {
            let containerType_arr = []

            for (let i = 0; i < fieldValue?.length; i++) {
                containerType_arr.push({ text: fieldValue[i].containerTypeText, code: fieldValue[i].type })
            }

            fieldsAndValues.push({
                fieldName, displayName, fieldType, fieldValue,
                confidence, field: aLabel.field, overrideValue, master_container_type:getConvertedMasterContainerType(containerType_arr)
            })
        }
        else{
            fieldsAndValues.push({
                fieldName, displayName, fieldType, fieldValue, 
                confidence, field: aLabel.field, overrideValue
            })
        }
    }

    await Model.findByIdAndUpdate(mongoose.Types.ObjectId(documentId), {
        $unset: {
            fieldsAndValues: 1
        }
    })

    await Model.findByIdAndUpdate(mongoose.Types.ObjectId(documentId), {
        $set: {
            fieldsAndValues: fieldsAndValues
        }
    })

    // console.log("processExtractedFields --- Done")
    return { fieldsAndValues }

}

module.exports = processExtractedFields

function getConvertedMasterContainerType(arr) {
    try {
        let jsonObject = arr?.map(JSON.stringify);
        let uniqueSet = new Set(jsonObject);
        return Array.from(uniqueSet).map(JSON.parse);
    } catch (error) {
        console.log("getConvertedMasterContainerType Catch", error , arr);
    }
    return [];
}