const Model = require("../documentType.model")

async function addDocumentType(data) {
    let created = await Model.create(data)
    return created
}

module.exports = addDocumentType