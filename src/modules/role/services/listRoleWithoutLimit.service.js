const Model = require("../role.model");

const RoleList = async () => {

	let filterQuery = { $and: [{ active: true }] };

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

    return {
        data: list
    };
};

module.exports = RoleList;
