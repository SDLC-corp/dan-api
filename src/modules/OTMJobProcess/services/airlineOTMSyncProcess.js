/* Refnum Qualifiers */

const { hasToOrderInString, isSameAsConsigneePresentInText } = require("../../../utils/AzureFieldExtractionUtils")
const { getAllQualifiersFromOtmAPI } = require("../../../utils/otmApiHelper")
const { DOCUMENT_TYPE_MAWB, MBL_QUALIFIERS, QUALIFIERS } = require("../services_push_Otm/const")
const processInvolvedParties = require("../services_push_Otm/service.processInvolvedParties")
const processPortDetailsFields = require("../services_push_Otm/service.processPortDetails")
const processRefNumQualifiers = require("../services_push_Otm/service.processRefnumQualifiers")
const processRemarksQualifiers = require("../services_push_Otm/service.processRemarksQualifiers")
const processShipUnitData = require("../services_push_Otm/service.processShipUnitData")

async function airlinesOTMSyncProcess({
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
}) {
    

    processShipUnitData({
        orderType,
        domainName: domainName,
        extractedData,
        documentNo,
        extractedField,
        entityDomain,
        jobId,
        taskCompletionUtils
    })
    
    
    processPortDetailsFields({
        orderType,
        domainName: domainName,
        extractedData,
        documentNo,
        extractedField,
        entityDomain,
        jobId,
        taskCompletionUtils
    })

    processRemarksQualifiers({
        orderType,
        domainName,
        documentNo,
        extractedField,
        entityDomain,
        documentType,
        jobId,
        taskCompletionUtils
    })

    processRefNumQualifiers({
        orderType,
        domainName,
        documentNo,
        extractedField,
        entityDomain,
        documentType,
        jobId,
        taskCompletionUtils
    })


    /* 
        -- or_inv_party --
    SHIPPER - done
    IATA_AGENT
    CONSIGNEE
    NOTIFY_PARTY_1
    */


    /* Use qualifiers By Type is MBL/HBL */
    let QUALIFIERS_KEY_ARR = []
    let QUALIFIERS_KEY_OBJ = {}

    if (documentType == DOCUMENT_TYPE_MAWB) {
        QUALIFIERS_KEY_ARR = Object.values(MBL_QUALIFIERS).map(q => q.otmQualifierName)
        QUALIFIERS_KEY_OBJ = MBL_QUALIFIERS
    } else {
        QUALIFIERS_KEY_ARR = Object.values(QUALIFIERS).map(q => q.otmQualifierName)
        QUALIFIERS_KEY_OBJ = QUALIFIERS
    }
   
    let deleteQualifierUrl = {}
    try {

        let qualifierArr = await getAllQualifiersFromOtmAPI({ documentNo, domainName: domainName, orderType })
        for (let idx = 0; idx < qualifierArr.length; idx++) {
            const qualifier = qualifierArr[idx];
            if (QUALIFIERS_KEY_ARR.indexOf(qualifier.involvedPartyQualGid) != -1) {
                let hrefLink = qualifier.links[0].href
                hrefLink = hrefLink.split("/involvedPartyContact")[0]

                deleteQualifierUrl[qualifier.involvedPartyQualGid] = hrefLink
            }
        }

    } catch (error) {

    }


    prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY: "SHIPPER",
        qualNameParamName: "shipper_name",
        qualAddressParamName: "shipper_address",
        qualCountryCodeParamName: "shipper_country_code"
    })


    prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY: "CONSIGNEE",
        qualNameParamName: "consignee_name",
        qualAddressParamName: "consignee_address",
        qualCountryCodeParamName: "consignee_country_code"
    })

    prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY: "NOTIFY_PARTY_1",
        qualNameParamName: "notify_name",
        qualAddressParamName: "notify_address",
        qualCountryCodeParamName: "notify_country_code"
    })

    prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY: "IATA_AGENT",
        qualNameParamName: "origin_agent_name",
        qualAddressParamName: "origin_agent_address",
        qualCountryCodeParamName: "origin_agent_country_code"
    })

    function prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY,
        qualNameParamName,
        qualAddressParamName,
        qualCountryCodeParamName,
        qualLocationGidParamName
    }) {
        const QUALIFIERS_DATA = QUALIFIERS_KEY_OBJ[QUALIFIERS_KEY_OBJ_KEY]
        const country_code = extractedField.getFieldVal(qualCountryCodeParamName)
        const name = extractedField.getFieldVal(qualNameParamName)
        const address = extractedField.getFieldVal(qualAddressParamName)
        const locationGid = extractedField.getFieldVal(qualLocationGidParamName)

        let otmQualGidToMap // IF the name is SAME_AS_CONSIGNEE or TW.TO_ORDER

        /* IF same as consignee text found in address ignore the process */
        const isToOrder = hasToOrderInString(name)
        const samAsConsignee = isSameAsConsigneePresentInText(name)

        if(samAsConsignee) {
            otmQualGidToMap = "TW.SAME_AS_CONSIGNEE"
        }
        if(isToOrder) {
            otmQualGidToMap = "TW.TO_ORDER"
        }
        
        processInvolvedParties({
            otmQualifierKey: QUALIFIERS_DATA.otmQualifierName, 
            deleteMappedQualifierUrl: deleteQualifierUrl[QUALIFIERS_DATA.otmQualifierName],
            rpaQualifierKey: QUALIFIERS_DATA.rpaQualifierName, 
            orderType, 
            country_code: country_code,
            locationName: name, 
            locationAddress: address,  
            location: domainName, 
            jobId,
            taskCompletionUtils, 
            bookingNo, 
            documentNo,
            locationGid,
            otmQualGidToMap
            
        })
    }
}

module.exports = airlinesOTMSyncProcess