const OTMPortMastersModel = require("../../portMaster/syncPortMaster.model");
const PortMasterModel = require("../../portMaster/portMaster.model");
const SyncConfigModel = require("../syncconfig.model");
const { getPortMasterAPI } = require("../../../utils/otmApiHelper");
const ApiError = require("../../../utils/ApiError");
const httpStatus = require("http-status");

const SYNC_TIME_LOG_LABEL = "SYNC PORT TIMELOG";
const BATCH_SYNC_TIME_LOG_LABEL = "BATCH SYNC TIMELOG";
const SYNC_CONFIG_ID = "PORT_MASTERS"

async function syncData() {
    try {
        console.time(SYNC_TIME_LOG_LABEL);

        let allowSyncAll = false;
        let lastSyncDate = null
        
        let lastSyncPortData = await SyncConfigModel.findOne({ syncId: SYNC_CONFIG_ID })
        if(lastSyncPortData) {
            lastSyncDate = new Date(lastSyncPortData.lastSyncDate)
            allowSyncAll = false
        } else {
            await SyncConfigModel.create({ syncId: SYNC_CONFIG_ID, lastSyncDate: new Date() })
            allowSyncAll = true;
        }

        const updatedDataIds = [];
        const limit = 1000; // Adjust the page size based on your needs
        let offset = 0;

        let hasMoreData = true;
        console.log("---START:SYNC PORT TIMELOG---");
        

        if(allowSyncAll) {
            console.time("DELETE_PORT");
            await PortMasterModel.deleteMany({ fromOTM: true});
            console.timeEnd("DELETE_PORT");
        }
        
        while (hasMoreData) {
            const response = await getPortMasterAPI({limit, offset: offset * limit, insertDate: lastSyncDate});
            const dataToSync = response.items;
            if (dataToSync.length > 0) {
                const portMasterArr = [];
                for (let idx = 0; idx < dataToSync.length; idx++) {
                    const rowData = dataToSync[idx];
                    if (rowData && rowData.locationXid?.length === 5) {
                        if (rowData.locationXid && rowData.locationName) {
                            portMasterArr.push({
                                locationXid: rowData.locationXid,
                                locationName: rowData.locationName,
                                locationGid: `TW.${rowData.locationXid}`,
                                fromOTM: true,
                                active: true,
                                lastSyncDate: new Date(),
                            });
                        }
                    } else {
                        updatedDataIds.push(rowData._id);
                    }
                    // let inserted = await PortMasterModel.insertMany(portMasterArr)
                }

                insertManyPortData({portMasterArr, iteration: offset + 1, logData: { limit, offset, items: dataToSync.length }})
                offset++; // Move to the next page
            } else {
                hasMoreData = false;
            }
        }

        // if (updatedDataIds.length) {
        //     try {
        //         const masterUpdate = await PortMasterModel.updateMany({ _id: updatedDataIds }, { $set: { fromOTM: true ,lastSyncDate: new Date()} });
        //     } catch (error) {
        //         console.log('Errror',error);
        //     }
        // }portMasterArr

        console.timeEnd(SYNC_TIME_LOG_LABEL);
        
    } catch (error) {
        console.error("Error:", error);
        console.log("---END:SYNC PORT TIMELOG---");
        console.timeEnd(SYNC_TIME_LOG_LABEL);
    }

    return true
}

async function insertManyPortData({portMasterArr, iteration=1, logData}) {
    const PORT_INSERT_MANY_LABEL = "PORT_INSERT_MANY_" + iteration
    try {
        console.time(PORT_INSERT_MANY_LABEL)
        console.table(logData)
        await PortMasterModel.insertMany(portMasterArr);
        console.timeEnd(PORT_INSERT_MANY_LABEL)
    } catch (error) {
        console.error("PORT_INSERT_MANY ::", logData, error);
        console.timeEnd(PORT_INSERT_MANY_LABEL)
    }
}
module.exports = syncData;