const Model = require("../airPortMaster.model");
const mongoose = require('mongoose');

async function updatePortMaster({id, data}) {
    let filterQuery = { _id: mongoose.Types.ObjectId(id)}
    let updatePortMaster = await Model.findOneAndUpdate(filterQuery, data)
    return updatePortMaster
}

module.exports = updatePortMaster