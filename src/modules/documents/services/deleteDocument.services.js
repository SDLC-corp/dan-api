const mongoose = require('mongoose');
const Model = require("../documents.model");
const { SendMailAPI } = require('../../../utils/emailServices');

const deleteDocument = async ({ id,loggedInUserId }) => {
    try {
        const documentId = mongoose.Types.ObjectId(id);

        const foundDoc = await Model.findOne(documentId)

        if (!foundDoc) {
            return false
        }

        const documentUpdate = await Model.updateOne(
            { _id: documentId, active: true },
            { $set: { active: false } }
        );

         if (documentUpdate.nModified > 0) {
            SendMailAPI(documentId)
            return { message: "Document was successfully deleted" };
        } else {
            return { message: "Document not found " };
        }

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = deleteDocument