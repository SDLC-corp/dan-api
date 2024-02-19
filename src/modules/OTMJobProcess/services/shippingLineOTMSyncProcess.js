const {
    isSameAsConsigneePresentInText,
    hasToOrderInString
} = require("../../../utils/AzureFieldExtractionUtils");

const {
    getAllQualifiersFromOtmAPI, markOtmSuccessFlagAPI,
} = require("../../../utils/otmApiHelper");

const {
    QUALIFIERS,
    DOCUMENT_TYPE_MBL,
    MBL_QUALIFIERS
} = require("../services_push_Otm/const");
const processPortDetailsFields = require("../services_push_Otm/service.processPortDetails");
const processInvolvedParties = require("../services_push_Otm/service.processInvolvedParties");
const processShipUnitData = require("../services_push_Otm/service.processShipUnitData");
const processCharterVoyageAndVesselFields = require("../services_push_Otm/service.processCharterVoyageAndVesselFields");
const processRefNumQualifiers = require("../services_push_Otm/service.processRefnumQualifiers");
const processRemarksQualifiers = require("../services_push_Otm/service.processRemarksQualifiers");



async function shippingLineOTMSyncProcess({
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
    
    /* Process Update Ship Unit/Container and Seal unit SHIPPER_SEAL_NUMBER, LINER_SEAL_NUMBER, CUSTOM_SEAL_NUMBER*/
    processShipUnitData({
        orderType,
        domainName: domainName,
        documentNo,
        extractedField,
        entityDomain,
        jobId,
        taskCompletionUtils
    })

    /* Charter Voyage */
    processCharterVoyageAndVesselFields({
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

    processRefNumQualifiers({
        orderType,
        domainName: domainName,
        documentNo,
        extractedField,
        entityDomain,
        documentType,
        jobId,
        taskCompletionUtils
    })
    processRemarksQualifiers({
        orderType,
        domainName: domainName,
        documentNo,
        extractedField,
        entityDomain,
        documentType,
        jobId,
        taskCompletionUtils
    })


    /* Use qualifiers By Type is MBL/HBL */
    let QUALIFIERS_KEY_ARR = []
    let QUALIFIERS_KEY_OBJ = {}

    if (documentType == DOCUMENT_TYPE_MBL) {
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
        QUALIFIERS_KEY_OBJ_KEY: "CARRIER",
        qualLocationGidParamName: "carrier_location_id"
    })


    prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY: "DESTINATION_AGENT",
        qualNameParamName: "destination_agent_name",
        qualAddressParamName: "destination_agent_address",
        qualCountryCodeParamName: "destination_agent_country_code"
    })

    prepareDataAndProcessInvolvedParties({
        QUALIFIERS_KEY_OBJ_KEY: "ORIGIN_AGENT",
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

module.exports = shippingLineOTMSyncProcess