const { 
    refnumCreationAPI,
    deleteRefnumAPI, 
    getRefnumQaulListByQualGid
} = require("../../../utils/otmApiHelper");

const { 
    DOCUMENT_TYPE_MBL, DOCUMENT_TYPE_MAWB, ORDER_RELEASES_ORDER_TYPE,
 } = require("../services_push_Otm/const");
const { updateJobStatusQualifier } = require("./service.updateJobStatus");


async function processRefNumQualifiers({
    documentNo,
    orderType,
    extractedField,
    documentType,
    entityDomain,
    domainName,
    jobId,
    taskCompletionUtils

}) {


    
    
        /* RefNum Remark Creation */
        const bl_no = extractedField.getFieldVal("bl_no")
        const dispatch_type = extractedField.getFieldVal("dispatch_type")
        const booking_number = extractedField.getFieldVal("booking_number")

    
        console.debug("processRefNumQualifiers ::", {
            bl_no,
            dispatch_type,
            booking_number
         });

        let BL_QUALIFIER_QUAL_GID = `${entityDomain}.HBL_NUMBER`
        let DISPATCH_TYPE_QUALIFIER_QUAL_GID = `${entityDomain}.DISPATCH_TYPE`
        let CARRIER_BOOKING_NUMBER_QUALIFIER = `${entityDomain}.CARRIER_BOOKING_NUMBER`




        const MAWB_NUMBER = extractedField.getFieldVal("mawb_number")
        const AWB_SHIPPER_ACCOUNT_NUMBER = extractedField.getFieldVal("shipper_account_number")
        const AWB_CONSIGNEE_ACCOUNT_NUMBER = extractedField.getFieldVal("consignee_account_number")
        const AGENT_IATA_CODE = extractedField.getFieldVal("iata_code")
        const AGENT_IATA_ACCOUNT_NO = extractedField.getFieldVal("iata_account_no")
        const AWB_DECLARED_VALUE_CARRIAGE = extractedField.getFieldVal("declared_value_carriage")
        const AWB_DECLARED_VALUE_CUSTOMS = extractedField.getFieldVal("declared_value_custom")
        const AWB_AMOUNT_OF_INSURANCE = extractedField.getFieldVal("amount_of_insurance")
        const AWB_RATE_CLASS = extractedField.getFieldVal("rate_class")
        
        
        /* Check for MBL : Qualifiers are different */
        if(documentType == DOCUMENT_TYPE_MBL){
            BL_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_NUMBER`
        }
        if(documentType == DOCUMENT_TYPE_MAWB){
            BL_QUALIFIER_QUAL_GID = `${entityDomain}.MBL_NUMBER`
        }


        if(orderType === ORDER_RELEASES_ORDER_TYPE) {
            
            if(MAWB_NUMBER) deleteAndRefNumCreateQualifier(`${entityDomain}.MBL_NUMBER`, MAWB_NUMBER)
            if(AWB_SHIPPER_ACCOUNT_NUMBER) deleteAndRefNumCreateQualifier(`${entityDomain}.AWB_SHIPPER_ACCOUNT_NUMBER`, AWB_SHIPPER_ACCOUNT_NUMBER)
            if(AWB_CONSIGNEE_ACCOUNT_NUMBER) deleteAndRefNumCreateQualifier(`${entityDomain}.AWB_CONSIGNEE_ACCOUNT_NUMBER`, AWB_CONSIGNEE_ACCOUNT_NUMBER)
            if(AGENT_IATA_CODE) deleteAndRefNumCreateQualifier(`${entityDomain}.AGENT_IATA_CODE`, AGENT_IATA_CODE)
            if(AGENT_IATA_ACCOUNT_NO) deleteAndRefNumCreateQualifier(`${entityDomain}.AGENT_IATA_ACCOUNT_NO`, AGENT_IATA_ACCOUNT_NO)
            if(AWB_DECLARED_VALUE_CARRIAGE) deleteAndRefNumCreateQualifier(`${entityDomain}.AWB_DECLARED_VALUE_CARRIAGE`, AWB_DECLARED_VALUE_CARRIAGE)
            if(AWB_DECLARED_VALUE_CUSTOMS) deleteAndRefNumCreateQualifier(`${entityDomain}.AWB_DECLARED_VALUE_CUSTOMS`, AWB_DECLARED_VALUE_CUSTOMS)
            if(AWB_AMOUNT_OF_INSURANCE) deleteAndRefNumCreateQualifier(`${entityDomain}.AWB_AMOUNT_OF_INSURANCE`, AWB_AMOUNT_OF_INSURANCE)
            if(AWB_RATE_CLASS) deleteAndRefNumCreateQualifier(`${entityDomain}.AWB_RATE_CLASS`, AWB_RATE_CLASS)

        } else {
            if(booking_number) {
                deleteAndRefNumCreateQualifier(CARRIER_BOOKING_NUMBER_QUALIFIER, booking_number)
            }
    
            if(bl_no){
                deleteAndRefNumCreateQualifier(BL_QUALIFIER_QUAL_GID, bl_no)
            } 
    
            if(dispatch_type){
                deleteAndRefNumCreateQualifier(DISPATCH_TYPE_QUALIFIER_QUAL_GID, dispatch_type)
            } 
        }

     
       
        async function deleteAndRefNumCreateQualifier(obRefnumQualGid, obRefnumValue) {

            let payload = { items: [{
                "obRefnumQualGid": obRefnumQualGid,
                "obRefnumValue": obRefnumValue
            }]}

            if(orderType === ORDER_RELEASES_ORDER_TYPE) {
                payload = { items: [{
                    "orderReleaseRefnumQualGid": obRefnumQualGid,
                    "orderReleaseRefnumValue": obRefnumValue
                }]}
            }
            
 
            let QUAL = obRefnumQualGid.split(".")[1]

            let qualItem = await getRefnumQaulListByQualGid({orderType, domainName, documentNo, obRefnumQualGid: obRefnumQualGid});
            // await utilUpdateJobStatus(QUAL, "Check Qualifier in OTM", 1)
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

                    let toDelQualGid = toDel.obRefnumQualGid || toDel.orderReleaseRefnumQualGid
                    let toDelQualVal = toDel.obRefnumValue || toDel.orderReleaseRefnumValue
                    if(obRefnumQualGid == toDelQualGid) {
                        let res = await deleteRefnumAPI({
                            orderType,
                            domainName,
                            documentNo,
                            qualifierGID: toDelQualGid, 
                            obRefnumValue: toDelQualVal
                        });
        
                        if(res.success) {
                            await updateJobStatusQualifier({
                                qualifier: QUAL,
                                stepKey: "STEP1",
                                value: {
                                    status: 1,
                                    title: "Delete",
                                    payload: JSON.stringify({
                                        qualifierGID: toDelQualGid, 
                                        obRefnumValue: toDelQualVal
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
                                        qualifierGID: toDelQualGid, 
                                        obRefnumValue: toDelQualVal
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
                let refNumRes = await refnumCreationAPI({orderType, documentNo, domainName, payload: payload})
                if(refNumRes.success) {
                    await updateJobStatusQualifier({
                        qualifier: QUAL,
                        stepKey: "STEP1",
                        value: {
                            status: 1,
                            title: "Refnum Creation",
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
                            title: "Refnum Creation",
                            payload: JSON.stringify(payload),
                            response: refNumRes.response
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
                        title: "Refnum Creation",
                        payload: JSON.stringify(payload),
                        response: ""
                    },
                    qualifierStatus: 0,
                    jobId,
                });
            }

            taskCompletionUtils.taskDone(`Refnum:${QUAL}`)
        }
}

module.exports = processRefNumQualifiers