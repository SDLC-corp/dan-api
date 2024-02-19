const Model = require("../labels.model")
const mongoose = require('mongoose');

async function update({ id, data, userId }) {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) }
    let update = await Model.findOneAndUpdate(filterQuery, { ...data, updatedBy: userId })
    return update
}

module.exports = update