const Model = require("../fields.model")
const mongoose = require('mongoose');

async function update({ id, data, userId, orgId }) {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(id), orgId: mongoose.Types.ObjectId(orgId) }
    let groupId
    if (data?.fieldGroupId?.trim() && data?.fieldGroupId) {
        groupId = mongoose.Types.ObjectId(data?.fieldGroupId)
    }else{
        groupId = null
    }
    let  update = await Model.findOneAndUpdate(filterQuery, { ...data, updatedBy: userId,fieldGroupId:groupId })
    return update
}

module.exports = update