const mongoose = require('mongoose');
const Model = require("../role.model");

const getRoleById = async ({ id, orgId, role }) => {
    try {
        let filterQuery = role === 'superAdmin' ? { _id: mongoose.Types.ObjectId(id), active: true }
            : { _id: mongoose.Types.ObjectId(id), orgId: mongoose.Types.ObjectId(orgId), active: true }
        return await Model.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getRoleById