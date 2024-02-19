const {
    updateInOrderPortVesselFieldsAPI,
} = require("../../../utils/otmApiHelper");
const { updateJobStatusQualifier } = require("./service.updateJobStatus");
const { ORDER_BASSES_ORDER_TYPE, NEW_STATUS, ORDER_RELEASES_ORDER_TYPE } = require("./const");

async function processPortDetailsFields({
    extractedField,
    orderType,
    domainName,
    documentNo,
    jobId,
    taskCompletionUtils
}) {

    const jobStatusQualifierKey = "PortDetails"
    const polLocationXid = extractedField.getLocationFieldVal("port_of_loading")
    const polLocationGid = extractedField.getLocationFieldVal("port_of_loading", true)

    const podLocationXid = extractedField.getLocationFieldVal("port_of_discharge");
    const podLocationGid = extractedField.getLocationFieldVal("port_of_discharge", true);

    let placeOfReceipt = extractedField.getLocationFieldVal("place_of_receipt", true);
    let placeOfDelivery = extractedField.getLocationFieldVal("place_of_delivery", true);

    let finalDestinationGid = extractedField.getLocationFieldVal("final_destination", true);
    let sourceGid = extractedField.getFieldVal("source");
    let destinationGid = extractedField.getLocationFieldVal("destination", true);
    const freight_term = extractedField.getFieldVal("freight_term")

    const chgs_code = extractedField.getFieldVal("chgs_code")
    const flight_2 = extractedField.getLocationFieldVal("flight_2", true)
    const flight_1 = extractedField.getLocationFieldVal("flight_1", true)
    const airport_of_departure = polLocationGid
    const airport_of_destination = podLocationGid
    // attribute6
    // attribute7 , attribute12
    // attribute14
    // get 3rd flight added in OR - TW

    // new refnum to be created 
    // paymentMethodCodeGid
    // PORT_OF_DIS_LOCATION_GID
    

    console.debug("\n ProcessPortDetailsFields", {
        polLocationXid,
        polLocationGid,
        podLocationXid,
        podLocationGid,
        placeOfReceipt,
        placeOfDelivery,
        finalDestinationGid,
        destinationGid,
        chgs_code,
        flight_2,
        flight_1,
        airport_of_departure,
        airport_of_destination
    });


    let portPayload = {
        attribute3: placeOfReceipt, // Place of Receipt
        PORT_OF_LOAD_LOCATION_GID: polLocationGid, // Port of Loading
        PORT_OF_DIS_LOCATION_GID: podLocationGid, // Port of Discharge
        attribute6: finalDestinationGid, // Final Destination
    };


    // attribute1: sourceGid
        // attribute2: destinationGid, // Destination - not send 
        // PRIMARY_LEG_DEST_LOC_GID: placeOfDelivery, // Destination

    if (orderType == ORDER_RELEASES_ORDER_TYPE) { 
        portPayload = {
            attribute7:  flight_1,
            attribute12: flight_1
        }

        if(flight_2) portPayload["attribute14"] = flight_2
        
    }
    if (orderType == ORDER_BASSES_ORDER_TYPE) {
        // attribute2: destinationGid, // Destination - not send 
        // attribute1: sourceGid - not send 
        portPayload = {
            attribute3: placeOfReceipt, // Place of Receipt
            attribute4: polLocationGid, // Port of Loading
            attribute5: podLocationGid, // Port of Discharge
            attribute6: finalDestinationGid, // Final Destination
        };
    }

    if(freight_term) portPayload["paymentMethodCodeGid"] = freight_term
    if(chgs_code) portPayload["paymentMethodCodeGid"] = chgs_code

    let resP = await updateInOrderPortVesselFieldsAPI({
        orderType,
        domainName,
        documentNo,
        payload: portPayload,
    });
    if (resP.success) {
        await updateJobStatusQualifier({
            qualifier: jobStatusQualifierKey,
            stepKey: "STEP1",
            value: {
                status: 1,
                title: NEW_STATUS[jobStatusQualifierKey]["STEP1"].title,
                payload: JSON.stringify(portPayload),
            },
            qualifierStatus: 1,
            jobId,
        });
        taskCompletionUtils.taskDone(jobStatusQualifierKey)
    } else {
        await updateJobStatusQualifier({
            qualifier: jobStatusQualifierKey,
            stepKey: "STEP1",
            value: {
                status: 3,
                title: NEW_STATUS[jobStatusQualifierKey]["STEP1"].title,
                payload: JSON.stringify(portPayload),
                response: resP.response
            },
            qualifierStatus: 3,
            jobId,
        });
    }

    
}

module.exports = processPortDetailsFields;
