const Model = require('../documents.model')
const mongoose = require('mongoose');
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status');


const list = async ({ limit = 100, page = 0, orgId, filter, role }) => {
    let filterQuery = role === 'superAdmin' ? { $and: [{ active: true }] } : { $and: [{ active: true, orgId: mongoose.Types.ObjectId(orgId) }] };
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

    if (filter?.documentTypeId) {
        filterQuery.$and.push({ documentTypeId: mongoose.Types.ObjectId(filter?.documentTypeId) })
    }

    if (filter?.domainName?.length) {
        filterQuery.domainName = { $in: filter.domainName };
    }

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
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $lookup: {
                from: "documenttypes",
                localField: "documentTypeId",
                foreignField: "_id",
                as: "documentType",
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
                path: "$documentType",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                documentTypeId: 1,
                documentUrl: 1,
                documentNo: 1,
                document: 1,
                createdBy: 1,
                createdAt: 1,
                seqId: 1,
                fieldsAndValues: 1,
                "documentType.code": 1,
                "documentType.name": 1,
                "user.name": 1,
            },
        },
    ];



    try {
        const list = await Model.aggregate(aggregateQuery)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(Number(limit));


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