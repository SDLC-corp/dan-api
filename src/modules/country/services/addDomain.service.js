const Model = require("../domain.model")

async function addCountry({ label, parentId }) {
    let created = await Model.create({ label, parentId })
    return created
}

module.exports = addCountry