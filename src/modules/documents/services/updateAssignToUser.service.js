const mongoose = require('mongoose');
const Model = require("../documents.model");

const updateAssignUser = async ({documentId,userId}) => {
    try {
        const documentIdd = mongoose.Types.ObjectId(documentId);
        const userIdd = mongoose.Types.ObjectId(userId);

        const documentUpdate = await Model.updateOne({ _id: documentIdd }, { $set:{assignTo:userIdd} });
        return documentUpdate

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = updateAssignUser