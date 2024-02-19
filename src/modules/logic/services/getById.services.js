const mongoose = require('mongoose');
const Model = require("../logic.model");

const getLogicById = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id) }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getLogicById