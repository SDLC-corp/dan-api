const Model = require('../documents.model')
const JoB = require('../../OTMJobProcess/OTMJobProcess.model')
const mongoose = require('mongoose');
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');


const list = async ({ limit = 100, page = 0 }, filter, loggedInUser) => {
    let filterQuery = { $and: [{ active: true }] };
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    if (filter?.searchTxt && filter?.searchTxt != "") {
        let addSearchQuery
        if (Number(filter?.searchTxt)) {
            addSearchQuery = {
                $or: [
                    { seqId: parseInt(filter.searchTxt) },
                    { "fieldsAndValues.fieldValue": filter.searchTxt },
                ]
            }
        } else {
            let searchRegEx = { $regex: filter?.searchTxt, $options: "i" }
            addSearchQuery = {
                $or: [
                    { documentNo: searchRegEx },
                    { domainName: searchRegEx },
                    { "fieldsAndValues.fieldValue": searchRegEx },
                ]
            }
        }
        filterQuery = { ...filterQuery, ...addSearchQuery }
    }

    if (filter?.shippingLineId && filter?.shippingLineId != "") { filterQuery.$and.push({ shippingLineId: mongoose.Types.ObjectId(filter?.shippingLineId) }) }

    if (filter?.documentType) {
        filterQuery.$and.push({ documentType: { $regex: filter?.documentType, $options: "i" } })
    }
   
    if (filter?.domainName?.length) {
        filterQuery.domainName = { $in: filter.domainName };
    }
    // Filters for LoggedInUser === "Admin"

    if (loggedInUser.role == "documentation") {
        const LoggedInUserId = mongoose.Types.ObjectId(loggedInUser._id);
        filterQuery.$and.push({ assignTo: LoggedInUserId })
        if (filter?.searchTxt && filter.searchTxt != "") {
            let searchQuery
            if (Number(filter.searchTxt)) {
                searchQuery = {
                    $or: [
                        { seqId: parseInt(filter.searchTxt) },
                        { "fieldsAndValues.fieldValue": filter.searchTxt },
                    ],
                    assignTo: LoggedInUserId,
                };
            } else {
                let searchRegEx = { $regex: filter.searchTxt, $options: "i" }
                searchQuery = {
                    $or: [
                        { documentNo: searchRegEx },
                        { domainName: searchRegEx },
                        { "fieldsAndValues.fieldValue": searchRegEx },
                    ],
                    assignTo: LoggedInUserId,
                };
            }
            filterQuery.$and.push(searchQuery);
        }

        if (filter?.shippingLineId && filter.shippingLineId != "") {
            filterQuery.$and.push({
                shippingLineId: mongoose.Types.ObjectId(filter.shippingLineId),
                assignTo: LoggedInUserId,
            });
        }

        if (filter?.documentType && filter.documentType != "") {
            const documentTypeQuery = {
                documentType: { $regex: filter.documentType, $options: "i" },
                assignTo: LoggedInUserId,
            };
            filterQuery.$and.push(documentTypeQuery);
        }

        if (filter?.fromDate && filter?.toDate) {
            const fromDate = new Date(filter.fromDate);
            const toDate = new Date(filter.toDate);

            const dateRangeQuery = {
                createdAt: {
                    $gte: new Date(fromDate.setHours(0, 0, 0, 0)),
                    $lte: new Date(toDate.setHours(23, 59, 59, 999)),
                },
                assignTo: LoggedInUserId,
            };
            filterQuery.$and.push(dateRangeQuery);
        }
    }

    // Filters for LoggedInUser === "Admin"

    if (filter?.fromDate && filter?.toDate) {
        const fromDate = new Date(filter?.fromDate);
        const toDate = new Date(filter?.toDate);
        const startDate = new Date(Math.min(fromDate, toDate));
        const endDate = new Date(Math.max(fromDate, toDate));
        filterQuery.$and.push({
            createdAt: {
                $gte: new Date(startDate.setHours(0, 0, 0, 0)),
                $lte: new Date(endDate.setHours(23, 59, 59, 999)),
            },
        });
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
                createdAt: 1,
                seqId: 1,
                stageType:1,
                orderTypeGid: 1,
                fieldsAndValues: 1,
                "shippingLine.name": 1,
                "shippingLine.code": 1,
                "shippingLine._id": 1,
                "user.name": 1,
                "assignToUser.name": 1,
                "assignToUser._id": 1,
                syncWithOtm: 1,
                lastSyncTime: 1,
            },
        },
    ];



   try {
     const list = await Model.aggregate(aggregateQuery)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(Number(limit));

       for (let idx = 0; idx < list.length; idx++) {
        const doc = list[idx];
        let errorCount = 0
        const job = await JoB.findOne({documentId: doc._id, active: true})
        if(job) {
            const statusData = job.status
            for (const key in statusData) {
                for (const key2 in statusData[key]) {
                    const statusValue = statusData[key][key2].status;
                    if (Number(statusValue) !== 1 && (statusValue || statusValue === 0)) {
                        errorCount++
                    }
                }
            } 
        }
     doc.errorCount = errorCount
   }


    const totalCount = await Model.countDocuments(filterQuery)
    const filteredCount = await Model.countDocuments(filterQuery)
    return {
        data: list,
        totalCount,
        filteredCount,
        page,
        limit
    };
   } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!")
   }
};


module.exports = list