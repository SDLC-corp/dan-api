const mongoose = require('mongoose');
const Model = require("../labels.model");

const getLabelById = async (id) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
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
                    from: "fields",
                    localField: "fieldId",
                    foreignField: "_id",
                    as: "field",
                },
            },
            {
                $lookup: {
                    from: "logics",
                    localField: "logicCodeId",
                    foreignField: "_id",
                    as: "logic",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "oclUpdatedBy",
                    foreignField: "_id",
                    as: "overrideLogicUser",
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
                    path: "$field",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$logic",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$overrideLogicUser",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    label: 1,
                    shippingLineId: 1,
                    fieldId: 1,
                    logicCodeId: 1,
                    isOverride: 1,
                    overrideCustomLogic: 1,
                    oclUpdatedBy:1,
                    oclUpdatedAt:1,
                    'overrideLogicUser.name':1,
                    'overrideLogicUser._id':1,
                    "logic.textArea": 1,
                    "field._id": 1,
                    "field.displayName": 1,
                    "shippingLine.name": 1,
                    "logic._id": 1,
                },
            },
        ];
        return await Model.aggregate(aggregateQuery)
    } catch (error) {
        return null
    }
}
module.exports = getLabelById