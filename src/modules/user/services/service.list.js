const mongoose  = require('mongoose');
const model = require('./../user.model')

const usersList = async ({limit=100, page=0},search) => {

	let filterQuery = { $and: [{ active: true,role: {$ne: "superAdmin"}}] };

	const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
	const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
	const skip = (start - 1) * length;

	
	if (search?.name && search?.name != "") {
		var searchRegex = new RegExp(`.*${search?.name}.*`, "i")
		filterQuery.$and.push({
			$or: [
				{ name: { $regex: searchRegex } },
				{ email: { $regex: searchRegex } },
			]
		})
	}

	if (search?.fromDate && search?.toDate) {
		const fromDate = new Date(search?.fromDate);
		const toDate = new Date(search?.toDate);
		const startDate = new Date(Math.min(fromDate, toDate));
		const endDate = new Date(Math.max(fromDate, toDate));
		filterQuery.$and.push({
			createdAt: {
				$gte: new Date(startDate.setHours(0, 0, 0, 0)),
				$lte: new Date(endDate.setHours(23, 59, 59, 999)),
			},
		});
	}

    if (search?.role) {
        filterQuery.roleId = mongoose.Types.ObjectId(search?.role);
    }

    const aggregateQuery = [
        {
            $match: filterQuery,
        },
        {
            $lookup: {
                from: "roles",
                localField: "roleId",
                foreignField: "_id",
                as: "role",
            },
        },
        {
            $unwind: {
                path: "$role",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                profilePic: 1,
                name: 1,
                email: 1,
                domain: 1,
                approvalDomain: 1,
                createdAt: 1,
                updatedAt: 1,
                createdBy: 1,
                roleId:1,
                "role.name": 1,
            },
        },
    ];
	
	const user = await model.aggregate(aggregateQuery)
                        .sort({_id: -1})
                        .skip(skip)
                        .limit(Number(limit))
	const totalCount = await model.countDocuments(filterQuery)
	const filteredCount = await model.countDocuments(filterQuery)
	return {
		data: user,
		totalCount,
		filteredCount,
		page,
		limit
	};
};


module.exports = usersList