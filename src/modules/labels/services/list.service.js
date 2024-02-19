const Model = require("../labels.model");
const mongoose = require("mongoose");

const fieldsList = async ({ limit = 10, page = 0 }, search) => {

  let list = [];
  let totalCount;
  let filteredCount;
  limit = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
  const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  const skip = (start - 1) * limit;
  let filterQuery = { $and: [{ active: true }] };

  if (search?.documentTypeId) { filterQuery.$and.push({ documentTypeId: mongoose.Types.ObjectId(search?.documentTypeId) }) }
  
  if (search?.name && search?.name != "") {
    var searchRegex = new RegExp(`.*${search?.name}.*`, "i")
    filterQuery.$and.push({
      label: { $regex: searchRegex }
    })
  }
  const aggregateQuery = [
    {
      $match: filterQuery,
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
      $unwind: {
        path: "$documentType",
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
      $project: {
        label: 1,
        documentTypeId: 1,
        fieldId: 1,
        logicCodeId: 1,
        "field._id": 1,
        "field.displayName": 1,
        "field.paramName": 1,
        "field.seqId": 1,
        "documentType.name": 1,
        "documentType.modelId": 1,
        "documentType.description": 1,
        "documentType.logo": 1,
        "logic._id": 1,
        "logic.shortCode": 1,
        "logic.textArea": 1
      },
    },
  ];

  list = await Model.aggregate(aggregateQuery)
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 });

  totalCount = await Model.countDocuments(filterQuery);
  filteredCount = await Model.countDocuments(filterQuery);

  return {
    data: list,
    totalCount,
    filteredCount,
    page,
    limit,
  };

};

module.exports = fieldsList;
