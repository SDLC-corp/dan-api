const Model = require("../role.model")
const mongoose = require('mongoose');

async function update({ id, data }) {
    let filterQuery = { _id: mongoose.Types.ObjectId(id) }

    // update
    let update = await Model.findOneAndUpdate(filterQuery, { name: data.name, description: data.description, disabledModules: data.disabledModules })
    // let update = await Model.findOneAndUpdate(filterQuery, { ...data, updatedBy: userId })
    return update
}

module.exports = update