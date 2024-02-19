const {
    ExtractedFields,
    TaskCompletionUtils,
} = require("../../../utils/AzureFieldExtractionUtils");

const {
    markOtmSuccessFlagAPI, markNoOtmSuccessFlagAPI,
} = require("../../../utils/otmApiHelper");

const DocModel = require("../../documents/documents.model");
const JobModel = require("../OTMJobProcess.model");
const ShippingLine = require("../../shippingLine/shippingLine.model")

const { updateJobStatusStep, updateJobStatusQualifier } = require("../services_push_Otm/service.updateJobStatus");
const airlinesOTMSyncProcess = require("./airlineOTMSyncProcess");
const shippingLineOTMSyncProcess = require("./shippingLineOTMSyncProcess");
const { ORDER_RELEASES_ORDER_TYPE } = require("../services_push_Otm/const");

async function startProcessPushToOTM({_id: jobId, documentId}) {

    

    try {
        await DocModel.findByIdAndUpdate(documentId, {
            $set: {
                syncWithOtm: true,
                lastSyncTime: new Date()
            }
        })
        await JobModel.findByIdAndUpdate(jobId, {
            $set: {
                startTime: new Date()
            }
        })
    } catch (error) {

    }

    // try {
    //    await markNoOtmSuccessFlagAPI({

    //     })
    // } catch (error) {
    //     console.error("startProcessPushToOTM : Updating N flag", error);
    // }




    const {
        bookingNo,
        orderType,
        domainName,
        extractedData,
        fieldsAndValues,
        documentNo,
        documentType,
        shippingLineId
    } = await DocModel.findById(documentId)


    const {type: carrierType} = await ShippingLine.findById(shippingLineId)

    // await updateJobStatusStep("OTM SUCCESS FLAG", "OTM SUCCESS FLAG", 0)

    // await updateJobStatusQualifier({
    //     qualifier: "OTM SUCCESS FLAG",
    //     stepKey: "status",
    //     value: 0,
    //     jobId
    // });


    let taskCompletionUtils = new TaskCompletionUtils({ orderType, domainName: domainName, documentNo, jobId})

    if (!fieldsAndValues) return console.log("Fields not extracted yet :")

    const extractedField = new ExtractedFields(fieldsAndValues)

    console.log("Start Process Push To OTM :::", carrierType, jobId.toString(), documentId.toString());

    let entityDomain = domainName.split("/") // TW/TIL/MUM
    entityDomain = `${entityDomain[0]}/${entityDomain[1]}` // TW/TIL


    await markOTMSuccessFlagNoInOTM({orderType, entityDomain, domainName: domainName, documentNo})


    if(carrierType === "air") {
        airlinesOTMSyncProcess({
            entityDomain,
            bookingNo,
            orderType,
            domainName,
            extractedData,
            documentNo,
            documentType,
            jobId,
            taskCompletionUtils,
            extractedField
        })
    } else {
        shippingLineOTMSyncProcess({
            entityDomain,
            bookingNo,
            orderType,
            domainName,
            extractedData,
            documentNo,
            documentType,
            jobId,
            taskCompletionUtils,
            extractedField
        })
    }
    


    
}

async function markOTMSuccessFlagNoInOTM({orderType, entityDomain, domainName, documentNo}) {
    const qualifierGID = `${entityDomain}.SCANNED_DATA_RECEIVED`
    let payload = {
        "items": [
            {
                "obRefnumQualGid": qualifierGID,
                "obRefnumValue": "N"
            }
        ]
    }

    if(orderType === ORDER_RELEASES_ORDER_TYPE) {
        payload = {
                "items": [
                    {
                        "orderReleaseRefnumQualGid": qualifierGID,
                        "orderReleaseRefnumValue": "N"
                    }
                ]
            }
    }

    try {
        let response = await markOtmSuccessFlagAPI({orderType, domainName, documentNo, payload, qualifierGID})
    } catch (error) {
        console.error("Error markOTMSuccessFlagNoInOTM", error);
    }

    return true
}
module.exports = startProcessPushToOTM

