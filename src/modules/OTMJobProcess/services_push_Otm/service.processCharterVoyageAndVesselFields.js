const moment = require("moment/moment");

const { 
    createCharterVoyageAPI,
    updateInOrderPortVesselFieldsAPI,
    checkCharterVoyageTransmissionStatusAPI, 
} = require("../../../utils/otmApiHelper");

const { 
    ORDER_BASSES_ORDER_TYPE,
    NEW_STATUS,
 } = require("../services_push_Otm/const");
const { updateJobStatusQualifier } = require("./service.updateJobStatus");

async function processCharterVoyageAndVesselFields({
    extractedField,
    orderType,
    domainName,
    documentNo,
    jobId,
    taskCompletionUtils
}) {
    console.log("Process Charter Voyage");
    const jobStatusQualifierKey = "CharterVoyage"
    const DischargeVoyageJobStatusQualifierKey = "DischargeCharterVoyage"
    const vdJobStatusQualifierKey = "VesselDetails"
    const dVesselDetJobStatusQualifierKey = "DischargeVesselDetails"
    const shipped_on_board = extractedField.getFieldVal("shipped_on_board")

    try {
        /* If invalid sob date take todays date but dont send ATD ref Charter voyage API*/
        var sobDate = moment(shipped_on_board).format("YYYYMMDD090000");
        if(sobDate == 'Invalid date') {
            sobDate = moment()
        } else {
            sobDate = moment(shipped_on_board)
        }
        var shipOnBoardDate = sobDate.format("YYYYMMDD090000");
        var shipOnBoardDateAfter7Day = sobDate.add(7, 'days').format('YYYYMMDD090000');
    } catch (error) {
        console.error("Error Process Charter Voyage sobDate ::", error);
    }

    
    const polLocationXid = extractedField.getLocationFieldVal("port_of_loading")
    const podLocationXid  = extractedField.getLocationFieldVal("port_of_discharge")
    
    const voyage_no = extractedField.getFieldVal("voyage_no")
    const vesselName  = extractedField.getFieldVal("vessel_name")
    const vesselNameGid  = "TW."+extractedField.getFieldVal("vessel_name")

    const dischargeVoyage = extractedField.getFieldVal("discharge_voyage_no")
    const dischargeVesselName = extractedField.getFieldVal("discharge_vessel_name")
    const dischargeVesselNameGid = `TW.${dischargeVesselName}`

    let vesselNameAndVoyageNoArr = [
        {
            vesselName: vesselName,
            voyage_no: voyage_no
        }
    ]

    try {

        if(dischargeVesselName && dischargeVoyage) {

            let dischargeCreateCHVPayload = {
                "CHARTER_VOYAGE_TYPE": "LINER",
                "VOYAGE_NAME": dischargeVoyage, // VOYAGE NO FROM BL
                "SOURCE_LOCATION_GID": polLocationXid, // port master sheet Port of Loading
                "DEPARTURE_DATE": shipOnBoardDate, //Shipped on Board
                "ESTIMATED_DEPARTURE_DATE": shipOnBoardDate, //Shipped on Board
                "DEST_LOCATION_GID": podLocationXid, // port master sheet Port of Discharge	
                "ARRIVAL_DATE": shipOnBoardDateAfter7Day, // ADD 7 DAYS TO SHIPPED ON BOARD DATE
                "ESTIMATED_ARRIVAL_DATE": shipOnBoardDateAfter7Day, // ADD 7 DAYS TO SHIPPED ON BOARD DATE
                "VESSEL_GID": dischargeVesselName, // VESSEL NAME FROM BL
                "CAPACITY_COMMIT_TIME": "86400",
                "BOOKING_FREEZE_TIME": "86400"
              }

              /* If SOB is present then send ATD */
              if(shipped_on_board) {
                dischargeCreateCHVPayload["ACTUAL_DEPARTURE_DATE"] = shipOnBoardDate
              }
            
              let dcvResponse = await createCharterVoyageAPI(dischargeCreateCHVPayload)
              if(dcvResponse.success){
                let dCreated = dcvResponse.response
                
    
                let proccedNext = await transmissionStatusProcess(DischargeVoyageJobStatusQualifierKey, dCreated["Transmission Id"])
                if(proccedNext) {

                    await updateJobStatusQualifier({
                        qualifier: DischargeVoyageJobStatusQualifierKey,
                        stepKey: "STEP1",
                        value: {
                            status: 1,
                            title: NEW_STATUS[DischargeVoyageJobStatusQualifierKey]["STEP1"].title,
                            response: JSON.stringify(dCreated, null, 4),
                            payload: JSON.stringify(dischargeCreateCHVPayload, null, 4),
                        },
                        jobId,
                    });

                }  else {
                    
                    return false // Charter voyage not created do not procced
                }
                
                const dCharterVoyageId = dCreated.CharterVoyageId
                let dVesselPayload = {
                    attribute20: dCharterVoyageId,
                    attribute14: dischargeVesselNameGid,
                    attribute15: dischargeVoyage
                };
    
                let dResV = await updateInOrderPortVesselFieldsAPI({
                    orderType,
                    domainName,
                    documentNo,
                    payload: dVesselPayload,
                });
                if (dResV.success) {
                  await updateJobStatusQualifier({
                      qualifier: dVesselDetJobStatusQualifierKey,
                      stepKey: "STEP1",
                      value: {
                          status: 1,
                          title: NEW_STATUS[dVesselDetJobStatusQualifierKey]["STEP1"].title,
                      },
                      qualifierStatus: 1,
                      jobId,
                  });
    
                  taskCompletionUtils.taskDone(dVesselDetJobStatusQualifierKey)
                } else {
                    await updateJobStatusQualifier({
                      qualifier: dVesselDetJobStatusQualifierKey,
                      stepKey: "STEP1",
                      value: {
                          status: 3,
                          title: NEW_STATUS[dVesselDetJobStatusQualifierKey]["STEP1"].title,
                          response: dResV.response,
                          payload: JSON.stringify(dVesselPayload)
                      },
                      qualifierStatus: 3,
                      jobId,
                  });
                }
    
              } else {
                await updateJobStatusQualifier({
                    qualifier: DischargeVoyageJobStatusQualifierKey,
                    stepKey: "STEP1",
                    value: {
                        status: 3,
                        title: NEW_STATUS[DischargeVoyageJobStatusQualifierKey]["STEP1"].title,
                        response: dcvResponse.response,
                        payload: JSON.stringify(dischargeCreateCHVPayload, null, 4)
                    },
                    qualifierStatus: 3,
                    jobId,
                });
                await updateJobStatusQualifier({
                    qualifier: DischargeVoyageJobStatusQualifierKey,
                    stepKey: "STEP2",
                    value: {
                        status: 0,
                        title: NEW_STATUS[DischargeVoyageJobStatusQualifierKey]["STEP2"].title,
                    },
                    jobId,
                });
              }
        }

    } catch (error) {
    }

    for (let idx = 0; idx < vesselNameAndVoyageNoArr.length; idx++) {
        const vvData = vesselNameAndVoyageNoArr[idx];
        const createCHVPayload = {
            "CHARTER_VOYAGE_TYPE": "LINER",
            "VOYAGE_NAME": vvData.voyage_no, // VOYAGE NO FROM BL
            "SOURCE_LOCATION_GID": polLocationXid, // port master sheet Port of Loading
            "DEPARTURE_DATE": shipOnBoardDate, //Shipped on Board
            "ESTIMATED_DEPARTURE_DATE": shipOnBoardDate, //Shipped on Board
            "DEST_LOCATION_GID": podLocationXid, // port master sheet Port of Discharge	
            "ARRIVAL_DATE": shipOnBoardDateAfter7Day, // ADD 7 DAYS TO SHIPPED ON BOARD DATE
            "ESTIMATED_ARRIVAL_DATE": shipOnBoardDateAfter7Day, // ADD 7 DAYS TO SHIPPED ON BOARD DATE
            "VESSEL_GID": vvData.vesselName, // VESSEL NAME FROM BL
            "CAPACITY_COMMIT_TIME": "86400",
            "BOOKING_FREEZE_TIME": "86400"
          }

          if(shipped_on_board) {
            createCHVPayload["ACTUAL_DEPARTURE_DATE"] = shipOnBoardDate
          }
        
          let cvResponse = await createCharterVoyageAPI(createCHVPayload)
          

          if (cvResponse.success) {

            let created = cvResponse.response

            


            const CharterVoyageId = created.CharterVoyageId


            let proccedNext = await transmissionStatusProcess(jobStatusQualifierKey, created["Transmission Id"])

            if(proccedNext) {
                await updateJobStatusQualifier({
                    qualifier: jobStatusQualifierKey,
                    stepKey: "STEP1",
                    value: {
                        status: 1,
                        title: NEW_STATUS[jobStatusQualifierKey]["STEP1"].title,
                        response: JSON.stringify(created, null, 4),
                        payload: JSON.stringify(createCHVPayload, null, 4),
                    },
                    jobId,
                });
            }  else {
                return false // Charter voyage not created do not procced
            }

            

              let vesselPayload = {
                  attribute12: vesselNameGid, // Vessel Name
                  attribute11: CharterVoyageId, // Vessel Schedule (charter voyage id)
                  attribute13: voyage_no, // Voyage No
              };

              if (orderType == ORDER_BASSES_ORDER_TYPE) {
                  vesselPayload = {
                      attribute12: vesselNameGid, // Vessel Name
                      attribute11: CharterVoyageId, // Vessel Schedule (charter voyage id)
                      attribute13: voyage_no, // Voyage No
                  };
              }

              let resV = await updateInOrderPortVesselFieldsAPI({
                  orderType,
                  domainName,
                  documentNo,
                  payload: vesselPayload,
              });
              if (resV.success) {
                await updateJobStatusQualifier({
                    qualifier: vdJobStatusQualifierKey,
                    stepKey: "STEP1",
                    value: {
                        status: 1,
                        title: NEW_STATUS[vdJobStatusQualifierKey]["STEP1"].title,
                    },
                    qualifierStatus: 1,
                    jobId,
                });

                taskCompletionUtils.taskDone(vdJobStatusQualifierKey)
              } else {
                  await updateJobStatusQualifier({
                    qualifier: vdJobStatusQualifierKey,
                    stepKey: "STEP1",
                    value: {
                        status: 3,
                        title: NEW_STATUS[vdJobStatusQualifierKey]["STEP1"].title,
                        response: resV.response,
                        payload: JSON.stringify(vesselPayload)
                    },
                    qualifierStatus: 3,
                    jobId,
                });
              }
          } else {
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: "STEP1",
                value: {
                    status: 3,
                    title: NEW_STATUS[jobStatusQualifierKey]["STEP1"].title,
                    response: cvResponse.response,
                    payload: JSON.stringify(createCHVPayload, null, 4)
                },
                qualifierStatus: 3,
                jobId,
            });
            await updateJobStatusQualifier({
                qualifier: jobStatusQualifierKey,
                stepKey: "STEP2",
                value: {
                    status: 0,
                    title: NEW_STATUS[jobStatusQualifierKey]["STEP2"].title,
                },
                jobId,
            });
            await updateJobStatusQualifier({
                qualifier: vdJobStatusQualifierKey,
                stepKey: "STEP1",
                value: {
                    status: 0,
                    title: NEW_STATUS[vdJobStatusQualifierKey]["STEP1"].title,
                },
                qualifierStatus: 0,
                jobId,
            });
          }
          
    }


    async function transmissionStatusProcess(jobStatusKey, transmissionId) {
        let cvtsRes = await checkCharterVoyageTransmissionStatusAPI({transmissionId})
        if(cvtsRes.success) {
            let tsResponse = cvtsRes.response

            if(tsResponse && tsResponse.progress != "failed") {
                let modResponse = JSON.stringify(cvtsRes.response, null, 4)
                await updateJobStatusQualifier({
                    qualifier: jobStatusKey,
                    stepKey: "STEP2",
                    value: {
                        status: 1,
                        title: NEW_STATUS[jobStatusKey]["STEP2"].title,
                        response: modResponse,
                        payload: JSON.stringify({"Transmission Id": transmissionId})
                    },
                    qualifierStatus: 1,
                    jobId,
                });
                return true
            } else {
                let modResponse = JSON.stringify(cvtsRes.response, null, 4)
                await updateJobStatusQualifier({
                    qualifier: jobStatusKey,
                    stepKey: "STEP2",
                    value: {
                        status: 3,
                        title: NEW_STATUS[jobStatusKey]["STEP2"].title,
                        response: modResponse,
                        payload: JSON.stringify({"Transmission Id": transmissionId})
                    },
                    qualifierStatus: 3,
                    jobId,
                });
            }

        }  else {
            await updateJobStatusQualifier({
                qualifier: jobStatusKey,
                stepKey: "STEP2",
                value: {
                    status: 3,
                    title: NEW_STATUS[jobStatusKey]["STEP2"].title,
                    response: cvtsRes.response,
                    payload: JSON.stringify({"Transmission Id": transmissionId})
                },
                qualifierStatus: 3,
                jobId,
            });
        }

        return false
    }



    
    
}

module.exports = processCharterVoyageAndVesselFields