const PortMasterModel = require('../portMaster.model')
const AirPortMasterModel = require('../../airPortMaster/airPortMaster.model')
async function getAllPortMaster(type) {

	let list
    if (type == "air") {
	    list = await AirPortMasterModel.find({active: true}, 'locationGid locationName locationXid').lean();
    }else{
	    list = await PortMasterModel.find({active: true}, 'locationGid locationName locationXid').lean();
    }
	return list
}
module.exports = getAllPortMaster