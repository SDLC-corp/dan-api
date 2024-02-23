const mongoose = require('mongoose');
const Model = require("../fields.model");

const getFieldById = async ({id,orgId}) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true, orgId: mongoose.Types.ObjectId(orgId) }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getFieldById