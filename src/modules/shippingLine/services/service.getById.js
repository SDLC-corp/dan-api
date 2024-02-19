const mongoose = require('mongoose');
const Model = require("../shippingLine.model");

const getUserById = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getUserById