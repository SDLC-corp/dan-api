const Model = require("../logic.model")
const mongoose = require('mongoose');
const BackUpModel = require("../backupLogic.model")

async function update({ id, data, userId }) {
    let filterQuery = { _id: mongoose.Types.ObjectId(id) }

    // for backup
    let {name,shortCode,textArea} = await Model.findById(filterQuery)
        textArea = textArea.split('&lt;').join('<');
        await BackUpModel.create({name,shortCode,textArea,createdBy:userId,updatedBy:userId})


    // update
    data.textArea = data.textArea.split('&lt;').join('<');
    let update = await Model.findOneAndUpdate(filterQuery, { ...data, updatedBy: userId })
    return update
}

module.exports = update