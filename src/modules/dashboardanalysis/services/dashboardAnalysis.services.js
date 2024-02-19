const documentsModel = require("../../documents/documents.model")
const userModel = require("../../user/user.model")
const mongoose = require('mongoose');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */

const getDocumentAnalytics = async (loggedInUser, filter,shippingLine) => {

  let documentCount
  let shippingLineCounts
  let domainCount
  const currentDate = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  let filterQuery = { $and: [{ active: true }] };
  let mblFilterQuery = { $and: [{ active: true, documentType: 'MBL' }] };
  let hblFilterQuery = { $and: [{ active: true, documentType: 'HBL' }] };
  let syncWithOtmFilterQuery = { $and: [{ active: true, syncWithOtm: true }] };
  let asyncWithOtmFilterQuery = { $and: [{ active: true, syncWithOtm: false }] };
  const userQuery = { $and: [{ active: true}] }
let documentAgregateQueryGraph = {
$and: [{ active: true }]
}
    if (!filter) {
    // documentAgregateQueryGraph.$and.push ({
    //     createdAt: {
    //         $gte: oneWeekAgo,
    //         $lte: currentDate,
    //     }
    // })
    }

  if (loggedInUser?.role == 'documentation') { documentAgregateQueryGraph.$and.push({ createdBy: mongoose.Types.ObjectId(loggedInUser?._id) }) }
  if (loggedInUser?.role == 'documentation') { filterQuery.$and.push({ createdBy: mongoose.Types.ObjectId(loggedInUser?._id) }) }
  if (loggedInUser?.role == 'documentation') { mblFilterQuery.$and.push({ createdBy: mongoose.Types.ObjectId(loggedInUser?._id) }) }
  if (loggedInUser?.role == 'documentation') { hblFilterQuery.$and.push({ createdBy: mongoose.Types.ObjectId(loggedInUser?._id) }) }
  if (loggedInUser?.role == 'documentation') { syncWithOtmFilterQuery.$and.push({ createdBy: mongoose.Types.ObjectId(loggedInUser?._id) }) }
  if (loggedInUser?.role == 'documentation') { asyncWithOtmFilterQuery.$and.push({ createdBy: mongoose.Types.ObjectId(loggedInUser?._id) }) }

  const aggregateQuery = [
    {
      $match: filterQuery,
    },
    {
      $lookup: {
        from: "documents",
        localField: "documentId",
        foreignField: "_id",
        as: "documentsdata",
      },
    },
    {
      $unwind: {
        path: "$documentsdata",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userdata",
      },
    },
    {
      $unwind: {
        path: "$userdata",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        documentId: 1,
        createdBy: 1,
        createdAt: 1,
        seqId: 1,
        "documentsdata.bookingNo": 1,
        "documentsdata.documentNo": 1,
        "documentsdata.fieldsAndValues": 1,
        "userdata.name": 1,
      },
    },
  ];

  // show last 30 days transactions outgoing   
  const documentAgregateQuery = [
    {
      $match: documentAgregateQueryGraph
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { date: "$createdAt", format: "%Y-%m-%d" } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        date: "$_id.date",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { date: 1 },
    },
  ];
  // show last 30 days transactions outgoing  

  // show last 30 days transactions outgoing   
  const documentUploadedByUserAgregateQuery = [
    {
      $match: filterQuery,
    },
    {
      $group: {
        _id: "$createdBy",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userdata",
      },
    },
    {
      $unwind: {
        path: "$userdata",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        createdBy: "$userdata.name",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { createdBy: 1 }, // Sort by the "createdBy" field
    },
  ];
  // show last 30 days transactions outgoing  

  // show last 30 days Document uploaded By Shipping Line  
  const documentUploadedByShippingLineAgregateQuery = [
    {
      $match: documentAgregateQueryGraph,
    },
    {
      $group: {
        _id: "$shippingLineId",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "shippinglines",
        localField: "_id",
        foreignField: "_id",
        as: "shippingLinedata",
      },
    },
    {
      $unwind: {
        path: "$shippingLinedata",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        shippingLineName: "$shippingLinedata.name",
        shippingLineId: "$shippingLinedata._id",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { shippingLineId: 1 }, // Sort by the "createdBy" field
    },
  ];


  if (filter && filter?.createdAt ) {
    documentAgregateQueryGraph.$and.push({
      createdAt: filter?.createdAt,
    });
    filterQuery.$and.push({
      createdAt: filter?.createdAt,
    });
    mblFilterQuery.$and.push({
      createdAt: filter?.createdAt,
    });
    hblFilterQuery.$and.push({
      createdAt: filter?.createdAt,
    });
    syncWithOtmFilterQuery.$and.push({
      createdAt: filter?.createdAt,
    });
    asyncWithOtmFilterQuery.$and.push({
      createdAt: filter?.createdAt,
    });
    userQuery.$and.push({
      createdAt: filter?.createdAt,
    });
  }


  

  if (shippingLine?.length >0) {

  const shippingLineObjectIds = shippingLine.map(id =>  mongoose.Types.ObjectId(id));
    documentAgregateQueryGraph.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
    filterQuery.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
    mblFilterQuery.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
    hblFilterQuery.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
    syncWithOtmFilterQuery.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
    asyncWithOtmFilterQuery.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
    userQuery.$and.push({
      shippingLineId: { $in: shippingLineObjectIds },
    });
  }

  try {
    documentCount = await documentsModel.countDocuments(filterQuery)
    
    let userCount
    if (filter || shippingLine?.length ) {
        let userCountArray = await documentsModel.aggregate(documentUploadedByUserAgregateQuery);
        userCount = userCountArray.length
    }else{
        userCount = await userModel.countDocuments(userQuery);
    }

    const mblDocumentTypeCount = await documentsModel.countDocuments(mblFilterQuery)
    const hblDocumentTypeCount = await documentsModel.countDocuments(hblFilterQuery)
    const syncWithOtmDocumentCount = await documentsModel.countDocuments(syncWithOtmFilterQuery)
    const asyncWithOtmDocumentCount = await documentsModel.countDocuments(asyncWithOtmFilterQuery)
    let lastThirtyDaysUploadedDocumentCount = await documentsModel.aggregate(documentAgregateQuery, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        return result;
      }
    });
    let documentUploadedByUser = await documentsModel.aggregate(documentUploadedByUserAgregateQuery, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        return result;
      }
    });
  let documentUploadedByShippingLine = await documentsModel.aggregate(documentUploadedByShippingLineAgregateQuery, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        return result;
      }
    });

    return {
      data: {
        documentsCount: documentCount, 
        shippingLineCounts:shippingLineCounts,
        domainCount:domainCount,
        userCount: userCount,
        lastThirtyDaysUploadedDocumentCount: lastThirtyDaysUploadedDocumentCount,
        mblDocumentTypeCount: mblDocumentTypeCount, hblDocumentTypeCount: hblDocumentTypeCount,
        asyncWithOtmDocumentCount: asyncWithOtmDocumentCount, syncWithOtmDocumentCount: syncWithOtmDocumentCount,
        documentUploadedByUser: documentUploadedByUser,documentUploadedByShippingLine:documentUploadedByShippingLine
      },
      status: true, code: 200
    }

  } catch (error) {
    return {
      data: error.message, status: false, code: 500
    }
  }
};


module.exports = getDocumentAnalytics
