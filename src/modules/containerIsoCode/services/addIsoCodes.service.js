const Model = require("../isoCodes.model");

async function addIsoCode(data) {
    let created = await Model.create(data)
    return created
}

module.exports = addIsoCode