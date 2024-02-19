const mongoose = require('mongoose');
const Model = require("../labels.model");

const deleteLogic = async ({ id, userId }) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id) }
        return await Model.findOneAndUpdate(filterQuery, { active: false, updatedBy: userId })
    } catch (error) {
        return null
    }
}
module.exports = deleteLogic