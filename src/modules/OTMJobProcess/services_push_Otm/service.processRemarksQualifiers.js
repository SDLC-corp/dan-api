const moment = require("moment")
const { 
    refnumCreationAPI,
    remarkCreationAPI,
    deleteRefnumAPI,
    deleteRemarksAPI,
    getOrderBaseRemarksAPI,
    getRefnumQaulListByQualGid
} = require("../../../utils/otmApiHelper");

const { 
    DOCUMENT_TYPE_MBL,
    DOCUMENT_TYPE_HBL,
    DOCUMENT_TYPE_MAWB,
    ORDER_BASSES_ORDER_TYPE,
    ORDER_RELEASES_ORDER_TYPE
 } = require("../services_push_Otm/const");
const { updateJobStatusQualifier } = require("./service.updateJobStatus");

async function processRemarksQualifiers({
    documentNo,
    orderType,
    extractedField,
    documentType,
    entityDomain,
    domainName,
    jobId,
    taskCompletionUtils

}) {

         /* Remark Creation */
         const place_of_issue = extractedField.getFieldVal("place_of_issue")
         let date_of_issue = extractedField.getFieldVal("date_of_issue")
         const marks_and_numbers = extractedField.getFieldVal("marks_and_numbers")
         const description = extractedField.getFieldVal("description")
 
         let BL_QUALIFIER_QUAL_GID = `${entityDomain}.HBL_NUMBER`
 
         let PLACE_OF_ISSUE_QUALIFIER_QUAL_GID
         let DATE_OF_ISSUE_QUALIFIER_QUAL_GID
         let BL_SAID_TO_CONTAIN_QUALIFIER_QUAL_GID = `${entityDomain}.BL_SAID_TO_CONTAIN`
         let BL_MARKS_AND_NUMBERS_QUALIFIER_QUAL_GID = `${entityDomain}.BL_MARKS_AND_NUMBERS`


        /* airlines start */
            const AWB_ACCOUNTING_INFORMATION = extractedField.getFieldVal("accounting_information")
            const LOAD_FLIGHT_ETD = extractedField.getFieldVal("requested_flight_date")
            const AWB_HANDLING_INFORMATION = extractedField.getFieldVal("marks_and_numbers")
            const AWB_NATURE_AND_QUANTITY_OF_GOODS = extractedField.getFieldVal("nature_and_quantity_of_goods")
            const SIGNATURE_OF_SHIPPER_OR_HIS_AGENT = extractedField.getFieldVal("signature_of_shipper_agent")
            const MAWB_DATE_OF_ISSUE = extractedField.getFieldVal("date_of_issue")
            const MAWB_PLACE_OF_ISSUE = extractedField.getFieldVal("place_of_issue")
            const Signature_of_Issuing_Carrier_or_its_Agent = extractedField.getFieldVal("Signature_of_Issuing_Carrier_or_its_Agent")
        /* airlines end */



         try {
            if(date_of_issue) {
                date_of_issue = moment(date_of_issue).format("YYYY-MM-DD")
                if(date_of_issue == 'Invalid date') date_of_issue = ""
            }
         } catch (error) {
            date_of_issue = ""
         }
         console.debug("processRemarksQualifiers ::", {
            place_of_issue,
            date_of_issue,
            marks_and_numbers,
            description
         });
         
         /* Check for MBL : Qualifiers are different */
         if(documentType == DOCUMENT_TYPE_MBL){
             BL_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_NUMBER`
             
             /* SEND ONLY IN MBL */
             PLACE_OF_ISSUE_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_PLACE_OF_ISSUE`
             DATE_OF_ISSUE_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_DATE_OF_ISSUE`
         }

         if(documentType == DOCUMENT_TYPE_MAWB) {
            PLACE_OF_ISSUE_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_DATE_OF_ISSUE`
            DATE_OF_ISSUE_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_PLACE_OF_ISSUE`
         }
 








         /* SEND ONLY IN MBL */
         if(place_of_issue && PLACE_OF_ISSUE_QUALIFIER_QUAL_GID){
            deleteAndRemarkCreateQualifier(PLACE_OF_ISSUE_QUALIFIER_QUAL_GID, place_of_issue)
        }

        /* SEND ONLY IN MBL */
        if(date_of_issue && DATE_OF_ISSUE_QUALIFIER_QUAL_GID) {
            deleteAndRemarkCreateQualifier(DATE_OF_ISSUE_QUALIFIER_QUAL_GID, date_of_issue)
        }
        
        
        
        if(orderType == ORDER_BASSES_ORDER_TYPE) {
            if(description) {
                deleteAndRemarkCreateQualifier(BL_SAID_TO_CONTAIN_QUALIFIER_QUAL_GID, description)
            }
            if(marks_and_numbers){
                deleteAndRemarkCreateQualifier(BL_MARKS_AND_NUMBERS_QUALIFIER_QUAL_GID, marks_and_numbers)
            }
        }

        if(orderType == ORDER_RELEASES_ORDER_TYPE) {
            /* AWB_ACCOUNTING_INFORMATION
            LOAD_FLIGHT_ETD
            AWB_HANDLING_INFORMATION
            AWB_NATURE_AND_QUANTITY_OF_GOODS
            SIGNATURE_OF_SHIPPER_OR_HIS_AGENT
            MAWB_DATE_OF_ISSUE
            MAWB_PLACE_OF_ISSUE
            Signature_of_Issuing_Carrier_or_its_Agent */

            if(AWB_ACCOUNTING_INFORMATION) {
                deleteAndRemarkCreateQualifier(`${entityDomain}.AWB_ACCOUNTING_INFORMATION`, AWB_ACCOUNTING_INFORMATION)
            }
            if(LOAD_FLIGHT_ETD) {
                deleteAndRemarkCreateQualifier(`${entityDomain}.LOAD_FLIGHT_ETD`, LOAD_FLIGHT_ETD)
            }
            if(AWB_HANDLING_INFORMATION) {
                deleteAndRemarkCreateQualifier(`${entityDomain}.AWB_HANDLING_INFORMATION`, AWB_HANDLING_INFORMATION)
            }
            if(AWB_NATURE_AND_QUANTITY_OF_GOODS) {
                deleteAndRemarkCreateQualifier(`${entityDomain}.AWB_NATURE_AND_QUANTITY_OF_GOODS`, AWB_NATURE_AND_QUANTITY_OF_GOODS)
            }

            if(SIGNATURE_OF_SHIPPER_OR_HIS_AGENT) {
                deleteAndRemarkCreateQualifier(`${entityDomain}.SIGNATURE_OF_SHIPPER_OR_HIS_AGENT`, SIGNATURE_OF_SHIPPER_OR_HIS_AGENT)
            }

            if(Signature_of_Issuing_Carrier_or_its_Agent) {
                deleteAndRemarkCreateQualifier(`${entityDomain}.Signature_of_Issuing_Carrier_or_its_Agent`, Signature_of_Issuing_Carrier_or_its_Agent)
            }


        }










        async function deleteAndRemarkCreateQualifier(remarkQualGid, remarkText) {
            let payload = { items: [{
                "remarkQualGid": remarkQualGid,
                "remarkText": remarkText
            }]}
 
            let QUAL = remarkQualGid.split(".")[1]

            let qualItem = await getOrderBaseRemarksAPI({
                orderType,
                domainName,
                documentNo,
                remarkQualGid: remarkQualGid
            })
            
            await updateJobStatusQualifier({
                qualifier: QUAL,
                stepKey: "STEP1",
                value: {
                    status: 1,
                    title: "Check Qualifier in OTM",
                },
                jobId,
            });
            let allowToCreate = true
            
            /* Deleting present qualifiers */
            if(qualItem && qualItem.length){
                for (let dIdx = 0; dIdx < qualItem.length; dIdx++) {
                    const toDel = qualItem[dIdx];
                    
                    if(remarkQualGid == toDel.remarkQualGid) {
                        let res = await deleteRemarksAPI({
                            orderType,
                            domainName,
                            documentNo,
                            remarkQualGid: remarkQualGid,
                            remarkSequence: toDel.remarkSequence
                        })
        
                        if(res.success) {
                            await updateJobStatusQualifier({
                                qualifier: QUAL,
                                stepKey: "STEP1",
                                value: {
                                    status: 1,
                                    title: "Delete",
                                    payload: JSON.stringify({
                                        remarkQualGid: remarkQualGid,
                                        remarkSequence: toDel.remarkSequence
                                    }),
                                },
                                jobId,
                            });
                        }
                        else {
                            await updateJobStatusQualifier({
                                qualifier: QUAL,
                                stepKey: "STEP1",
                                value: {
                                    status: 3,
                                    title: "Delete",
                                    response: res.response,
                                    payload: JSON.stringify({
                                        remarkQualGid: remarkQualGid,
                                        remarkSequence: toDel.remarkSequence
                                    }),
                                },
                                jobId,
                            });
                            allowToCreate = false
                        } 
                    }
                }
            }        
            

            if(allowToCreate) {
                let remarkRes = await remarkCreationAPI({orderType, documentNo, domainName, payload: payload})
                if(remarkRes.success) {
                    await updateJobStatusQualifier({
                        qualifier: QUAL,
                        stepKey: "STEP1",
                        value: {
                            status: 1,
                            title: "Remark Creation",
                            payload: JSON.stringify(payload),
                        },
                        qualifierStatus: 1,
                        jobId,
                    });
                    
                } else {
                    await updateJobStatusQualifier({
                        qualifier: QUAL,
                        stepKey: "STEP1",
                        value: {
                            status: 3,
                            title: "Remark Creation",
                            payload: JSON.stringify(payload),
                            response: remarkRes.response
                        },
                        qualifierStatus: 3,
                        jobId,
                    });
                }
            } else {
                await updateJobStatusQualifier({
                    qualifier: QUAL,
                    stepKey: "STEP1",
                    value: {
                        status: 0,
                        title: "Remark Creation",
                        payload: JSON.stringify(payload),
                        response: ""
                    },
                    qualifierStatus: 0,
                    jobId,
                });
            }

            taskCompletionUtils.taskDone(`Remark:${QUAL}`)
        }
}

module.exports = processRemarksQualifiers