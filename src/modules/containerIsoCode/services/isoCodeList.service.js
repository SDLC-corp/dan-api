const IsoCodeModel = require('../isoCodes.model')

async function getAllIsoCode(search, limit = 10) {

    let filterQuery = {};

    filterQuery.$or = [];
    if (search && search !== "") {
        const searchRegex = new RegExp(`.*${search}.*`, "i");
        filterQuery.$or.push({ text: { $regex: searchRegex } });
        filterQuery.$or.push({ code: { $regex: searchRegex } });
    }
    if (filterQuery.$or.length === 0) {
        return await IsoCodeModel.find({}).limit(limit);
    }
    return await IsoCodeModel.find(filterQuery).limit(limit);

}

module.exports = getAllIsoCode