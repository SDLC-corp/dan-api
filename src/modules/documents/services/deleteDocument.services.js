const mongoose = require('mongoose');
const Model = require("../documents.model");
const RequestedDocModel = require("../../approvedtodeletedocument/model")
const JobModel = require('../../OTMJobProcess/OTMJobProcess.model');
const { SendMailAPI } = require('../../../utils/emailServices');
const addApprovedDocument = require('../../approvedtodeletedocument/services/addApprovedDocumentServices');

const deleteDocument = async ({ id,loggedInUserId }) => {
    try {
        const documentId = mongoose.Types.ObjectId(id);
        const filterQuerye= {documentId:documentId}
        let requestedBy = mongoose.Types.ObjectId(loggedInUserId);
        let deletedBy = mongoose.Types.ObjectId(loggedInUserId);
        let isDeleted = true;

        const getDocumentById = await Model.findOne(documentId)

        const documentUpdate = await Model.updateOne(
            { _id: documentId, active: true },
            { $set: { active: false } }
        );

        const requestedDocument = await RequestedDocModel.findOne(filterQuerye)
        console.log("requestedDocument::::::",requestedDocument);

        if (requestedDocument == null) {
            console.log("IFFFF");
            let addApprovedDocumentResult = await addApprovedDocument({ requestedBy, documentId, isDeleted,deletedBy });
        }
        else{
            const requestDocumentUpdate = await RequestedDocModel.updateOne(
                { documentId: documentId, active: true },
                {
                    $set: {
                        isDeleted: true,
                        deletedBy: loggedInUserId
                    }
                }
                );
                console.log("ELSEEE");
            }


        const jobUpdate = await JobModel.updateMany({ documentId, active: true }, {
            $set: { active: false}
        })

        if (documentUpdate.nModified > 0 && jobUpdate.nModified > 0) {
            SendMailAPI(documentId,getDocumentById.documentNo)
            return { message: "Document and associated jobs were successfully deactivated." };
        } else if (documentUpdate.nModified > 0) {
            SendMailAPI(documentId,getDocumentById.documentNo)
            return { message: "Document was successfully deactivated, but no associated jobs were found." };
        } else {
            return { message: "Document not found " };
        }

    } catch (error) {
        console.log("Error",error);
        return false;
    }
}
module.exports = deleteDocument