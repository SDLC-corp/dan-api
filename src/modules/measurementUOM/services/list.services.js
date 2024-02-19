const MeasurementUOMModel = require('../measurementUOM.model')

async function getAllMeasurementUOM(search, limit = 10) {

    limit = Number(limit);

    let filterQuery = {};

    filterQuery.$or = [];
    if (search && search !== "") {
        const searchRegex = new RegExp(`.*${search}.*`, "i");
        filterQuery.$or.push({ text: { $regex: searchRegex } });
        filterQuery.$or.push({ code: { $regex: searchRegex } });
    }
    if (filterQuery.$or.length === 0) {
        return await MeasurementUOMModel.find({}).limit(limit);
    }
    return await MeasurementUOMModel.find(filterQuery).limit(limit);

}

module.exports = getAllMeasurementUOM