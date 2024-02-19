const mongoose = require('mongoose');
const User = require('../user.model');

const updateUser = async (userId, body) => {
    const result = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId), active: true }, { password: body.password }, { new: true })
    return result
}

module.exports = updateUser