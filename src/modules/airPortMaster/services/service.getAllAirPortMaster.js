const PortMasterModel = require('../airPortMaster.model')
async function getAllPortMaster() {
	let list = await PortMasterModel.find({active: true}, 'locationGid locationName locationXid').lean();
	return list
}
module.exports = getAllPortMaster