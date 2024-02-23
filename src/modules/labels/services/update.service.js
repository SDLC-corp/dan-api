const Model = require("../labels.model")
const mongoose = require('mongoose');

async function update({ id, data, userId ,orgId}) {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id), orgId: mongoose.Types.ObjectId(orgId) }
    let update = await Model.findOneAndUpdate(filterQuery, { ...data, updatedBy: userId })
    return update
}

module.exports = update