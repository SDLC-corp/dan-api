const mongoose = require('mongoose');
const Model = require("../documents.model");
// const OTMJobProcess = require("../../OTMJobProcess/OTMJobProcess.model");
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');

const getUserById = async ({docId,loggedInUser}) => {
        let filterQuery = { _id: mongoose.Types.ObjectId(docId), active: true }

        if (loggedInUser.role == "documentation") {
            filterQuery ={...filterQuery, assignTo:mongoose.Types.ObjectId(loggedInUser._id)}
        }

        const aggregateQuery = [
            {
                $match: filterQuery,
            },
            {
                $lookup: {
                    from: "shippinglines",
                    localField: "shippingLineId",
                    foreignField: "_id",
                    as: "shippingLine",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "assignTo",
                    foreignField: "_id",
                    as: "assignToUser",
                },
            },
            {
                $unwind: {
                    path: "$shippingLine",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$assignToUser",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    domainName: 1,
                    shippingLineId: 1,
                    documentUrl: 1,
                    documentNo: 1,
                    bookingNo: 1,
                    documentType: 1,
                    document: 1,
                    createdBy: 1,
                    isJobDone: 1,
                    extractedData: 1,
                    isSuccess: 1,
                    orderType:1,
                    createdAt:1,
                    updatedAt:1,
                    seqId:1,
                    "shippingLine.name": 1,
                    "shippingLine.code": 1,
                    "shippingLine.type": 1,
                    "user.name": 1,
                    "jobs.status": 1,
                    "jobs.startTime": 1,
                    "jobs.endTime": 1,
                    "assignToUser.name": 1,
                    "assignToUser._id": 1,
                    fieldsAndValues: 1,
                    syncWithOtm: 1,
                    lastSyncTime: 1

                },
            },
        ];

        let result = await Model.aggregate(aggregateQuery);
            if (loggedInUser.role == "documentation" && !result.length ) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You do not have authorization to access this document", {}, "")
            }

        result = result[0]
        // let jobs = await OTMJobProcess.findOne({documentId: result._id}).sort({_id: -1})

            // if(jobs){
            //     result.jobs = jobs._doc
            // }
            if (result) {
                return result
            }else{
                return null
            }
}
module.exports = getUserById