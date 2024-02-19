const Model = require('../documents.model')
const mongoose = require('mongoose')


const list = async ( filter ) => {
  let filterQuery = { $and: [{ active: true }] };

  if (filter?.searchTxt && filter?.searchTxt != "") {
    let a = {
      $or: [
        { documentNo: { $regex: filter?.searchTxt, $options: "i" } },
        { domainName: { $regex: filter?.searchTxt, $options: "i" } },
        // { seqId: parseInt(filter?.searchTxt) },
        { "fieldsAndValues.fieldValue": { $regex: filter?.searchTxt, $options: "i" } },
      ]
    }
    filterQuery = { ...filterQuery, ...a }
  }

  if (filter?.shippingLineId && filter?.shippingLineId != "") { filterQuery.$and.push({ shippingLineId: mongoose.Types.ObjectId(filter?.shippingLineId) }) }

  if (filter?.documentType && filter?.documentType != "") {
    filterQuery.$and.push({ documentType: { $regex: filter?.documentType, $options: "i" } })
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
        path: "$assignToUser",
        preserveNullAndEmptyArrays: true,
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
        orderTypeGid: 1,
        stageType: 1,
        fieldsAndValues: 1,
        "shippingLine.name": 1,
        "shippingLine.code": 1,
        "shippingLine._id": 1,
        "assignToUser.name": 1,
        "assignToUser._id": 1,
        "user.name": 1,
        syncWithOtm: 1,
        lastSyncTime: 1
      },
    },
  ];

  const list = await Model.aggregate(aggregateQuery)
    .sort({ _id: -1 })

  const totalCount = await Model.countDocuments(filterQuery)
  const filteredCount = await Model.countDocuments(filterQuery)
  return {
    data: list,
    totalCount,
    filteredCount,
  };
};


module.exports = list