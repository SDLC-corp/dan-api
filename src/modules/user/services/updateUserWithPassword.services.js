const mongoose = require('mongoose');
const User = require('../user.model');

const updateUser = async ({userId, body,orgId}) => {
    const result = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId),
        orgId: mongoose.Types.ObjectId(orgId),
        active: true }, { password: body.password }, { new: true })
    return result
}

module.exports = updateUser