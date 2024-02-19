const mongoose = require('mongoose');
const Model = require('../documents.model');
const LabelsModel = require("../../labels/labels.model");
const LogicModal = require('../../logic/logic.model')
const DocumentTypeModel = require("../../documentTypes/documentType.model");
var safeEval = require('safe-eval');

async function processExtractedFields(documentId, clearOverrideValues) {
    const document = await Model.findById(documentId)
    let documentTypeId = document.documentTypeId

    const documentTypeDetails = await DocumentTypeModel.findById(documentTypeId);

    const portMasterArr = []
    const aggregateQuery = [
        {
            "$match": { active: true, documentTypeId: mongoose.Types.ObjectId(documentTypeDetails._id)}
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
                documentTypeId: 1,
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
    let fieldsAndValues = [];

    // reverting for temp as not able to fetch
    // let otmContainerList = await getContainerListAPI({ orderType, domainName, documentNo });
    // let arr = otmContainerList?.map(item => ({ text: item.transportHandlingUnitGid, code: item.transportHandlingUnitGid }));
    for (let i = 0; i < labels.length; i++) {
        const aLabel = labels[i];
        let fieldName = aLabel.field.paramName
        let displayName = aLabel.label
        let fieldType = aLabel.field.fieldType
        // let isCountryCodeField = false

        // if(fieldType == "master") {
        //     isCountryCodeField = aLabel.field?.master.collectionName == "countryCode"
        // }

        var context = {
            document: document,
            thisField: aLabel,
            fieldName:fieldName,
            portMasterArr: portMasterArr,
            allFields: labels,
            documentTypeDetails: documentTypeDetails,
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

        // if(isCountryCodeField){
        //     // console.log("--------------------------- Found country_code---------------------------",
        //     //  fieldType, fieldName, fieldValue);
        //     if(fieldValue){
        //         try {
        //             fieldValue = await getCountryCodeByAddress(fieldValue)
        //         } catch (error) {
        //             fieldValue = ""
        //         }
        //     } 
        // }

        if (fieldType === "table") {
            let containerType_arr = []

            for (let i = 0; i < fieldValue?.length; i++) {
                containerType_arr.push({ text: fieldValue[i].containerTypeText, code: fieldValue[i].type })
            }

            fieldsAndValues.push({
                fieldName, displayName, fieldType, fieldValue,
                confidence, field: aLabel.field, overrideValue, 
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

    return { fieldsAndValues }
}

module.exports = processExtractedFields

