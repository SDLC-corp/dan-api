const mongoose = require("mongoose");
const Model = require("../role.model");

const roleList = async ({ limit = 10, page = 0, orgId, search}) => {

    limit = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * limit;

	let filterQuery = { $and: [{ active: true , orgId: mongoose.Types.ObjectId(orgId) }] };

    if (search?.name && search?.name != "") {
		var searchRegex = new RegExp(`.*${search?.name}.*`, "i")
		filterQuery.$and.push({
			$or: [
				{name: { $regex: searchRegex }},
				{shortCode: { $regex: searchRegex }},
			]
		})
	  }

      if (search?.fromDate && search?.toDate) {
		const fromDate = new Date(search.fromDate);
		const toDate = new Date(search.toDate);
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
            $project: {
                name: 1,
                description: 1,
                disabledModules: 1,
                createdAt:1,
                updatedAt:1
            },
        },
    ];


    const list = await Model.aggregate(aggregateQuery)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)

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

module.exports = roleList;
