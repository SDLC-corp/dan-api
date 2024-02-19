const mongoose = require('mongoose');
const Model = require("../OTMJobProcess.model");

const getJobByDocumentId = async (id) => {
    try {
        let filterQuery = { documentId: mongoose.Types.ObjectId(id), active: true }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getJobByDocumentId