const getAllFreightTerm = require('../../freightterm/services/list.services');
const getAllCountryCode = require('../../contrycode/services/list.services');
const getAllIsoCode = require('../../containerIsoCode/services/isoCodeList.service');
const getAllPortMasterForCollection = require('./portMasterList.services');
const getAllWeightUOM = require('../../weightUOM/services/list.services');
const getAllMeasurementUOM = require('../../measurementUOM/services/list.services');
const getAllPackageTypeMaster = require('../../packageType/services/list.services');
const getAllItemMaster = require('../../itemMaster/services/list.services');
const getAirportMasterList = require('../../airPortMaster/services/airPortMasterList.services');

async function getAllPortMaster(collectionName, search) {
    if (collectionName === "port_masters") {
        return await getAllPortMasterForCollection(search)
    } else if (collectionName === "container_iso_codes") {
        return await getAllIsoCode(search)
    } else if (collectionName === "freightterm") {
        return await getAllFreightTerm(search)
    } else if (collectionName === "countryCode") {
        return await getAllCountryCode(search)
    } else if (collectionName === "weight_uom") {
        return await getAllWeightUOM(search)
    } else if (collectionName === "measurement_uom") {
        return await getAllMeasurementUOM(search)
    } else if (collectionName === "packageTypeMaster") {
        return await getAllPackageTypeMaster(search)
    } else if (collectionName === "itemMaster") {
        return await getAllItemMaster(search)
    } else if (collectionName === "air_port_masters") {
        return await getAirportMasterList(search)
    }

    return [];
}

module.exports = getAllPortMaster