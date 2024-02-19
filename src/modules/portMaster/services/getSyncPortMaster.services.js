const OTMPortMastersModel = require('../syncPortMaster.model')
const PortMasterModel = require('../portMaster.model')
const { getPortMasterAPI } = require('../../../utils/otmApiHelper');
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');


const SYNC_TIME_LOG_LABEL = "SYNC PORT TIMELOG"

async function syncData() {
    try {
  
      const limit = 100; // Adjust the page size based on your needs
      let offset = 0;
  
      let hasMoreData = true;
      console.log("---START:SYNC PORT TIMELOG---")
      console.time(SYNC_TIME_LOG_LABEL)
      while (hasMoreData) {
        const fromDate = new Date(); // Set your 'from' date
        const toDate = new Date(); // Set your 'to' date
        console.timeLog(SYNC_TIME_LOG_LABEL)
        
        const response = await getPortMasterAPI(limit, offset * limit)
  
        const dataToSync = response.items;
        console.table({limit, offset, items: dataToSync.length})
        if (dataToSync.length > 0) {
          // Insert or update data in MongoDB
          const result = await PortMasterModel.insertMany(dataToSync);
          console.log(`Inserted ${result.insertedCount} documents`);
          offset++; // Move to the next page
        } else {
          hasMoreData = false;
        }
        
      }

      console.log("---END:SYNC PORT TIMELOG---")
      console.timeEnd(SYNC_TIME_LOG_LABEL)
  
    } catch (error) {
      console.error('Error:', error);
      console.log("---END:SYNC PORT TIMELOG---")
      console.timeEnd(SYNC_TIME_LOG_LABEL)
    }
  }

  


const list = async () => {

    const response = await getPortMasterAPI(1000,0)

    if (response?.success) {
        let otmPortMastersArr = []
        otmPortMastersArr.push(...response.items)
        console.log('1 response.items',response.items.length);
        let limit = response.limit
        let totalLength = Math.round(response.totalResults/response.limit)
        for (let  i= 1;  i <= totalLength; i++) {
             const {items} = await getPortMasterAPI(limit,i*limit)
            console.log(i,'items.length',items.length);
            if (items?.length > 0) {
                otmPortMastersArr.push(...items)
            }
        }
        console.log("otmPortMastersArr.length",otmPortMastersArr.length);

        // Backup 
        await OTMPortMastersModel.deleteMany({})
        try {
            await  OTMPortMastersModel.create(otmPortMastersArr)
        } catch (error) {
                console.log('error',error);
        }

       
        // fetch data from port_masters
        let portData = await PortMasterModel.find({}).limit(4000)

        ref = new EnhanceFilter(portData)
        let addData = [], updatedDataIds =[]
        for (const otmPortCodeData of otmPortMastersArr) {
            if (otmPortCodeData?.locationXid?.length === 5) {
            const key = otmPortCodeData.locationXid + "--" + otmPortCodeData.locationName;
            const portCodeData = ref.getPortCodeData(key);
            if (portCodeData) {
                updatedDataIds.push(portCodeData._id);
            } else {
                if (otmPortCodeData.locationXid && otmPortCodeData.locationName) {
                addData.push({
                    locationXid: otmPortCodeData.locationXid,
                    locationName: otmPortCodeData.locationName,
                    locationGid: "TW." + otmPortCodeData.locationXid,
                    fromOTM: true,
                    lastSyncDate: new Date()
                });
                }
            }
            }
        }
        console.log('updatedDataIds',updatedDataIds);
            // update Last Sync time
            if (updatedDataIds?.length) {
                try {
                    const masterUpdate = await PortMasterModel.updateMany({ _id:updatedDataIds},{ $set: { fromOTM: true ,lastSyncDate: new Date()} });
                } catch (error) {
                    console.log('Errror',error);
                }
            }
            if (addData?.length) {
                try {
                    let add = await PortMasterModel.create(addData)
                } catch (error) {
                    console.log("Error Add from OTM",error);
                }
            }
        
        if (addData.length > 0) {
            // mod
            return {
                data: addData,
            };  
        }
       
    }else{
        throw new ApiError(httpStatus.BAD_REQUEST, "Not able to Sync port", {}, "")
    }
};

module.exports = list

class EnhanceFilter {
            _keyMap = {}
            constructor (listArr=[]) {
                listArr.map(obj=>this._keyMap[obj.locationXid+"--"+obj.locationName] = obj)
            }
            getPortCodeData(key) {
                return this._keyMap[key]
            }
        }