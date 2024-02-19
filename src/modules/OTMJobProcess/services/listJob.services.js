const Model = require("../OTMJobProcess.model");
const mongoose = require('mongoose')

const fieldsList = async ({ limit = 100, page = 0 }, search, fromDate, toDate, loggedInUser) => {

  let filterQuery = {}
  if (loggedInUser?.role == "documentation") {
     filterQuery = { $and: [{ active: true ,createdBy: mongoose.Types.ObjectId(loggedInUser._id)}] };
  }
  else{
     filterQuery = { $and: [{ active: true }] };
  }

  limit = parseInt(limit, 10);
  page = parseInt(page, 10);
  limit = limit > 0 ? limit : 10;
  page = page > 0 ? page : 1;
  const skip = (page - 1) * limit;

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
  ]


  if (search) {
    if (Number(search)) {
        aggregateQuery.push({
          $match: {
            $or: [
              { seqId: parseInt(search) }
            ],
          }
        })
    }else{
      const SEARCH_REGEX = new RegExp(`.*${search}.*`, "i")
      aggregateQuery.push({
        $match: {
          $or: [
            { "documentsdata.documentNo": { $regex: SEARCH_REGEX } },
            { "documentsdata.fieldsAndValues.fieldValue": { $regex: SEARCH_REGEX } },
          ],
        }
      })
    }
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const startDate = new Date(Math.min(from, to));
      const endDate = new Date(Math.max(from, to));
      aggregateQuery.push({
        $match: {
          $or: [
            {
              $and: [
                {
                  createdAt: {
                    $gte: new Date(startDate.setHours(0, 0, 0, 0)),
                    $lte: new Date(endDate.setHours(23, 59, 59, 999)),
                  }
                },
              ],
            },
          ],
        }
      })
    }
  }

  aggregateQuery.push({
    $project: {
      documentId: 1,
      createdBy: 1,
      createdAt: 1,
      updatedAt: 1,
      seqId: 1,
      "documentsdata.bookingNo": 1,
      "documentsdata.domainName": 1,
      "documentsdata.documentNo": 1,
      "documentsdata.fieldsAndValues": 1,
      "userdata.name": 1,
    },
  })

  const list = await Model.aggregate(aggregateQuery)
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(limit)
    .exec();
    
  const totalCount = await Model.countDocuments(filterQuery);
  const filteredCount = await Model.countDocuments(filterQuery);

  return {
    data: list,
    totalCount,
    filteredCount,
    page,
    limit,
  };
};

module.exports = fieldsList;