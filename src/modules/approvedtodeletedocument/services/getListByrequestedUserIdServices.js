const mongoose = require('mongoose');
const Model = require("../model");

const getDocumentByRequestedId = async ({ limit = 100, page = 0 },id) => {

    try {
        let filterQuery = { active: true, requestedBy: mongoose.Types.ObjectId(id),};
            console.log("id",id);
        limit = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * limit;

        const aggregateQuery = [
            {
                $match: filterQuery,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "requestedBy",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "deletedBy",
                    foreignField: "_id",
                    as: "deleteUserDetails",
                },
            },
            {
                $lookup: {
                    from: "documents",
                    localField: "documentId",
                    foreignField: "_id",
                    as: "documentsDetails",
                },
            },
            
            {
                $project: {
                    isDeleted: 1,
                    requestedBy: 1,
                    documentId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "userDetails.name": 1,
                    "userDetails._id": 1,
                    "deleteUserDetails.name": 1,
                    "deleteUserDetails._id": 1,
                    "documentsDetails.name": 1,
                    "documentsDetails._id": 1,
                    "documentsDetails.documentNo": 1,
                    "documentsDetails.fieldsAndValues": 1,
                    "documentsDetails.orderTypeGid": 1,
                    "documentsDetails.domainName": 1,
                    "documentsDetails.documentType": 1,
                },
            },
        ];
    

        const list = await Model.aggregate(aggregateQuery)
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 });

        const totalCount = await Model.countDocuments(filterQuery);
        return {
            data: list,
            totalCount,
            page,
            limit,
        };

    } catch (error) {
        console.log("ERorr",error);
        return false;
    }
}

module.exports = getDocumentByRequestedId;
