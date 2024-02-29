const mongoose  = require("mongoose");
const Model = require("../role.model");

const roleList = async ({ orgId, role }) => {

	let filterQuery = role==='superAdmin'? { $and: [{ active: true}] }:{ $and: [{ active: true, orgId: mongoose.Types.ObjectId(orgId) }] };

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

module.exports = roleList;
