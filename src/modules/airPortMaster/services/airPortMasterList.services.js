const PortMasterModel = require('../airPortMaster.model')

async function getAllPortMasterForCollection(search, limit = 10) {

    let filterQuery = {};

    filterQuery.$or = [];
    if (search && search !== "") {
        const searchRegex = new RegExp(`.*${search}.*`, "i");
        filterQuery.$or.push({ locationName: { $regex: searchRegex } });
        filterQuery.$or.push({ locationGid: { $regex: searchRegex } });
    }
    if (filterQuery.$or.length === 0) {
        return await PortMasterModel.find({}).limit(limit);
    }
    return await PortMasterModel.find(filterQuery).limit(limit);

}

module.exports = getAllPortMasterForCollection