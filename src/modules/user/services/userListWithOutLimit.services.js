const model = require('./../user.model')

const usersListWithOutLimit = async (search) => {

	let filterQuery = { $and: [{ active: true,role: {$ne: "superAdmin"}}] };
	
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
	
	const user = await model.find(filterQuery).sort({_id: -1});
	const totalCount = await model.countDocuments(filterQuery)
	const filteredCount = await model.countDocuments(filterQuery)
	return {
		data: user,
		totalCount,
		filteredCount,
	};
};


module.exports = usersListWithOutLimit