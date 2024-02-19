const Model = require('./../fields.model')

const fieldsList = async ({limit=100, page=0},search) => {
	let filterQuery = { $and: [{ active: true }] };
	const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
	const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
	const skip = (start - 1) * length;

	 if (Number(search?.name)) {
        filterQuery.$and.push({
		$or: [
			{ index: parseInt(search?.name) },
		]
	})} 
    else if (search?.name && search?.name != "") {
		var searchRegex = new RegExp(`.*${search?.name}.*`, "i")
		filterQuery.$and.push({
			$or: [
				{paramName: { $regex: searchRegex }},
				{displayName: { $regex: searchRegex }},
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
			$lookup: {
				from: "users",
				localField: "createdBy",
				foreignField: "_id",
				as: "createdUser",
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "updatedBy",
				foreignField: "_id",
				as: "updatedUser",
			},
		},
		{
			$project: {
                index:1,
				paramName: 1,
				displayName: 1,
                createdAt:1,
                updatedAt:1,
				"createdUser.name": 1,
				"createdUser._id": 1,
				"updatedUser.name": 1,
				"updatedUser._id": 1
			},
		},
	];



	const list = await Model.aggregate(aggregateQuery)
		.sort({ index:1 })
		.skip(skip)
		.limit(Number(limit));


	const totalCount = await Model.countDocuments(filterQuery);
	const filteredCount = await Model.countDocuments(filterQuery);
	return {
		data: list,
		totalCount,
		filteredCount,
		page,
		limit
	};
};


module.exports = fieldsList