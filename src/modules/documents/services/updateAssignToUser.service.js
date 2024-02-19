const mongoose = require('mongoose');
const Model = require("../documents.model");
const JobModel = require('../../OTMJobProcess/OTMJobProcess.model')

const updateAssignUser = async ({documentId,userId}) => {
    try {
        console.log('documentId',documentId);
        const documentIdd = mongoose.Types.ObjectId(documentId);
        const userIdd = mongoose.Types.ObjectId(userId);

        const documentUpdate = await Model.updateOne({ _id: documentIdd }, { $set:{assignTo:userIdd} });
        // const documentUpdate = await Model.findOne({ _id: documentIdd } );
        console.log('documentUpdate',documentUpdate);
        console.log('documentUpdate',documentUpdate);
        // const jobUpdate = await JobModel.updateMany({ documentId, active: true }, {
        //     $set: { active: false}
        // })

        // if (documentUpdate.nModified > 0 && jobUpdate.nModified > 0) {
        //     return { message: "Document and associated jobs were successfully deactivated." };
        // } else if (documentUpdate.nModified > 0) {
        //     return { message: "Document was successfully deactivated, but no associated jobs were found." };
        // } else {
        //     return { message: "Document not found " };
        // }
       
        return documentUpdate

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = updateAssignUser