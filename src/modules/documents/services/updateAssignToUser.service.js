const mongoose = require('mongoose');
const Model = require("../documents.model");

const updateAssignUser = async ({documentId,userId,orgId}) => {
    try {
        const documentIdd = mongoose.Types.ObjectId(documentId);
        const userIdd = mongoose.Types.ObjectId(userId);
        const orgIdd = mongoose.Types.ObjectId(orgId);

        const documentUpdate = await Model.updateOne({ _id: documentIdd,orgId:orgIdd }, { $set:{assignTo:userIdd} });
        return documentUpdate

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = updateAssignUser