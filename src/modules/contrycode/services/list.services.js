const CountryCodeModel = require('../contrycode.model')

async function getAllCountryCode(search, limit = 10) {

    limit = Number(limit);

    let filterQuery = {};

    filterQuery.$or = [];
    if (search && search !== "") {
        const searchRegex = new RegExp(`.*${search}.*`, "i");
        filterQuery.$or.push({ code: { $regex: searchRegex } });
        filterQuery.$or.push({ text: { $regex: searchRegex } });
    }
    if (filterQuery.$or.length === 0) {
        return await CountryCodeModel.find({}).limit(limit);
    }
    return await CountryCodeModel.find(filterQuery).limit(limit);

}

module.exports = getAllCountryCode