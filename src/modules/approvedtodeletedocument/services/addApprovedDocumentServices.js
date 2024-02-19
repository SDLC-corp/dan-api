const Model = require("../model")

async function addApprovedDocument(data) {
    let created = await Model.create(data)
    return created
}

module.exports = addApprovedDocument