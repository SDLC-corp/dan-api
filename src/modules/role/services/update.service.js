const Model = require("../role.model")
const mongoose = require('mongoose');

async function update({ id, data, orgId, role }) {
    let filterQuery = role === 'superAdmin' ? { _id: mongoose.Types.ObjectId(id) }
        : { _id: mongoose.Types.ObjectId(id), orgId: mongoose.Types.ObjectId(orgId) }

    // update
    let update = await Model.findOneAndUpdate(filterQuery, { name: data.name, description: data.description, disabledModules: data.disabledModules })
    // let update = await Model.findOneAndUpdate(filterQuery, { ...data, updatedBy: userId })
    return update
}

module.exports = update