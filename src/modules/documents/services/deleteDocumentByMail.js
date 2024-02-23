const mongoose = require('mongoose');
const Model = require("../documents.model");
const { SendMailAPI } = require('../../../utils/emailServices');
const User = require('../../user/user.model'); 

const deleteDocumentByMail = async ({ id, loggedInUser, orgId }) => {
    try {
        const filterQuery = {_id:id,active:true, orgId : mongoose.Types.ObjectId(orgId)}

        let recipients = []

        const documents = await Model.findOne(filterQuery);  
        
        // const users = await User.find({ role: 'admin',active:true ,approvalDomain: documents.domainName});
        const users = await User.find({ role: 'admin',active:true , orgId: mongoose.Types.ObjectId(orgId)});
        const emailAddresses = users.map(user => user.email);

        recipients = emailAddresses;

        if (emailAddresses.length > 0) {
            const documentId = mongoose.Types.ObjectId(id);
            const getDocumentById = await Model.findOne(documentId);

            if (getDocumentById) {
                const emailResult = await SendMailAPI(documentId, getDocumentById.documentNo, loggedInUser, recipients);
                if (emailResult) {
                    return { message: emailResult.message };
                } else {
                    return { message: emailResult.error };
                }
            }
        } else {
            console.log('No users found with email addresses::') 
            return false;
        }
    } catch (error) {
        console.log("Error services", error);
        return false;
    }
}

module.exports = deleteDocumentByMail;
