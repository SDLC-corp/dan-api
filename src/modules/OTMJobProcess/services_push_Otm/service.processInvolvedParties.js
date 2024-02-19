const { 
    checkPossibleXIDInOtmAPI,
    getLocationAddressAPI,
    checkInInvolvedPartyAddressAPI,
    deleteMappingAPI,
    performMappingAPI,
    createLocationAPI,
    apiDeleteByURL,
    checkLocationExistAPI,
} = require("../../../utils/otmApiHelper");

const JobModel = require("../OTMJobProcess.model");
const ShipperMasterModel = require("../shipperMaster.model");

const { 
    NEW_STATUS,
 } = require("../services_push_Otm/const");
const { updateJobStatusQualifier } = require("./service.updateJobStatus");


/*  rpaQualifierKey used only update the qualifier status in rpa database */
async function processInvolvedParties(data) {
    const {
        otmQualifierKey, 
        rpaQualifierKey, 
        orderType, 
        locationName, 
        locationAddress, 
        location, 
        jobId,
        country_code,
        taskCompletionUtils,
        bookingNo, 
        documentNo,
        locationGid,
        deleteMappedQualifierUrl,
        otmQualGidToMap
    } = data
    console.log("--- ProcessInvolvedParties START ---", country_code, locationGid, otmQualifierKey);

    var current_index = 0

    const modifiedShipperName = locationName?.split("").slice(0, 17).join("")
    const locationXidName = modifiedShipperName?.replace(/[^a-zA-Z0-9]/g, "_") // Replacing all spaces and special char [!@#$%^&*\n><?-~]
    
    /* Delete mapping */
    if(deleteMappedQualifierUrl){
        try {
            let res = await apiDeleteByURL(deleteMappedQualifierUrl)
            console.log("**** ", otmQualifierKey, " Mapping Deleted", res)
            if(res.status == "200"){
            } else {
                // console.error("Error Delete Mappings by url", otmQualifierKey, error);
                // await updateJobStatusStep("error", "Error while Delete Mappings (by url) : Not Moving forward")
                return console.log("Error while Delete Mappings (by url) : Not Moving forward", res.status)
            } 
           
        } catch (error) {
            console.error("Error Delete Mappings by url", otmQualifierKey, error);

            // await updateJobStatusStep("error", "Error while Delete Mappings (by url) : Not Moving forward")
            return console.log("Error while Delete Mappings (by url) : Not Moving forward")
        }
    }
    
    /* STEP 1 */

    /* STEP 2 */
    
    /* STEP 3 */
    async function checkLocationNameExistInOTM({locationName, locationAddress}) {
        const result = await checkLocationExistAPI({locationAddress, locationName})
        if(result.success) {
            
            const otmLocation = result.response.items[0]
            if(otmLocation) {
                performMapping(`TW.${otmLocation.locationXid}`)
            } else {
                let newLocationXid = getNextLocationXid(locationXidName, true)
                createLocation(newLocationXid)
            }

            try {
                let response = result.response

                if(response && response.items) delete response.items

                if(response && response.links) delete response.links

                await updateJobStatusQualifier({
                    qualifier: rpaQualifierKey,
                    stepKey: "STEP2",
                    value: {
                        status: 1,
                        text: NEW_STATUS[rpaQualifierKey]["STEP2"].text,
                        response: JSON.stringify(response)
                    },
                    qualifierStatus: 1,
                    jobId,
                });
            } catch (error) {
                console.error("IP CheckLocationNameExistInOTM ::", error);
            }
        } else {
            await updateJobStatusQualifier({
                qualifier: rpaQualifierKey,
                stepKey: "STEP2",
                value: {
                    status: 3,
                    text: NEW_STATUS[rpaQualifierKey]["STEP2"].text,
                    response: result.response
                },
                qualifierStatus: 3,
                jobId,
            });
        }
    }

    /* STEP 4  */
    async function createLocation(locationXid) {
        try {
            let res = await createLocationAPI({locationXid,  locationName,  locationAddress, country_code})
            performMapping(`TW.${locationXid}`) // GOTO STEP 7
        } catch (error) {
            return await updateJobStatusQualifier({
                qualifier: rpaQualifierKey,
                stepKey: "STEP3",
                value: {
                    status: 3,
                    text: NEW_STATUS[rpaQualifierKey]["STEP3"].text,
                    response: JSON.stringify({locationXid,  locationName,  locationAddress, country_code})
                },
                jobId,
            });
        }

        await updateJobStatusQualifier({
            qualifier: rpaQualifierKey,
            stepKey: "STEP3",
            value: {
                status: 1,
                text: NEW_STATUS[rpaQualifierKey]["STEP3"].text
            },
            jobId
        });
    }


    /* STEP 5  */

    /* STEP 6  */

    /* STEP 7  */
    async function performMapping(locationGid) {

        console.debug("\n IP STEP : 7 performMapping ", locationGid, otmQualifierKey);

        const response = await performMappingAPI({orderType, bookingNo, documentNo, domainName: location, otmQualifierKey, gid: locationGid})
        if(response.success) {
            await updateJobStatusQualifier({
                qualifier: rpaQualifierKey,
                stepKey: "STEP6",
                value: {
                    status: 1,
                    title: NEW_STATUS[rpaQualifierKey]["STEP6"].text,
                    response: response.response,
                    payload: JSON.stringify(response.payload)
                },
                qualifierStatus: 1,
                jobId,
            });
            taskCompletionUtils.taskDone(otmQualifierKey)
        } else {
            await updateJobStatusQualifier({
                qualifier: rpaQualifierKey,
                stepKey: "STEP6",
                value: {
                    status: 3,
                    title: NEW_STATUS[rpaQualifierKey]["STEP6"].text,
                    response: response.response,
                    payload: JSON.stringify(response.payload)
                },
                qualifierStatus: 3,
                jobId,
            });
        }

        
    }

    

    const getNextLocationXid = (locationXidName, next) => {
        if(next) {
            current_index++
        }
        return locationXidName + "_" + (parseInt(current_index, 10)).toString().padStart(2, 0)
    }
    
    /* If same as consignee or to order is exist directly mapped in otm */
    if (otmQualGidToMap) {
        performMapping(otmQualGidToMap)
        /* If location GID is exist directly mapped in otm (CARRIER) */
    } else if(locationGid) {
        performMapping(locationGid)
    } else {


        if(locationName && locationAddress) {
            // locationAddress
            /* Process starts from here  */
            /* Wait until locationXid not generate for previous qualifier */

            checkLocationNameExistInOTM({locationName, locationAddress})
            // const currentLocationXid = await getNextLocationXid(locationXidName, true)
            // return await createPossibleXId(locationName, currentLocationXid)
            
        } else {
            // await updateJobStatusQualifier({
            //     qualifier: rpaQualifierKey,
            //     stepKey: "STEP1",
            //     value: {
            //         status: 0,
            //         title: otmQualifierKey,
            //         response: "Missing address or name"
            //     },
            //     qualifierStatus: 0,
            //     jobId,
            // });
            return
        }
    }
}

module.exports = processInvolvedParties