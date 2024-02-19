const Model = require("../logic.model");

const listAll = async (filter,search) => {

	let filterQuery = { $and: [{ active: true }] };

     if (search?.name && search?.name != "") {
		var searchRegex = new RegExp(`.*${search?.name}.*`, "i")
		filterQuery.$and.push({
			$or: [
				{name: { $regex: searchRegex }},
			]
		})
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
                name: 1,
                shortCode: 1,
                textArea: 1,
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
        .sort({ _id: -1 })

    const totalCount = await Model.countDocuments(filterQuery);
    return {
        data: list,
        totalCount: totalCount,
        filteredCount: totalCount
    };
};

module.exports = listAll;
