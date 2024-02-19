const mongoose = require('mongoose');
const User = require('../user.model');

const updateUser = async (userId, body) => {
    let filterQuery = { _id: mongoose.Types.ObjectId(userId), active: true }
    const updatedResult = await User.findOneAndUpdate(filterQuery, body)
    return updatedResult   
}

module.exports = updateUser