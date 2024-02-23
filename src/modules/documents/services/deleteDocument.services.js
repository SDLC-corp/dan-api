const mongoose = require('mongoose');
const Model = require("../documents.model");
const { SendMailAPI } = require('../../../utils/emailServices');

const deleteDocument = async ({ id,orgId }) => {
    try {
        const documentId = mongoose.Types.ObjectId(id);
        orgId = mongoose.Types.ObjectId(orgId);

        const foundDoc = await Model.findOne({_id:documentId,orgId})

        console.log("foundDoc",foundDoc);

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