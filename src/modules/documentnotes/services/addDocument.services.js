const Model = require("../documentNotes.model")

async function addDocumentNotes(data) {
    let created = await Model.create(data)
    return created
}

module.exports = addDocumentNotes