const mongoose = require('mongoose');
const User = require("../user.model");

const getUserById = async ({id,orgId}) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true, orgId : mongoose.Types.ObjectId(orgId)}
        return await User.findOne(filterQuery)
    } catch (error) {
        return null
    }
}
module.exports = getUserById