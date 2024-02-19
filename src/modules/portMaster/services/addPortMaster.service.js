const Model = require("../portMaster.model");

async function addPortMaster(data) {
    let created = await Model.create(data)
    return created
}

module.exports = addPortMaster