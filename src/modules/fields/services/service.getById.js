const mongoose = require('mongoose');
const Model = require("../fields.model");

const getFieldById = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getFieldById