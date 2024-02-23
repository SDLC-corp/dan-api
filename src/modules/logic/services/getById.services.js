const mongoose = require('mongoose');
const Model = require("../logic.model");

const getLogicById = async ({id,orgId}) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), orgId: mongoose.Types.ObjectId(orgId) }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getLogicById