const mongoose = require('mongoose');
const Model = require("../documents.model");

const updateAsSyncWithOTM = async (documentId) => {
    try {
        const docId = mongoose.Types.ObjectId(documentId);
        const documentUpdate = await Model.updateOne({ _id: docId }, { $set:{syncWithOtm:false} });
        return documentUpdate

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = updateAsSyncWithOTM