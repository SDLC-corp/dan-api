const mongoose = require('mongoose');
const Model = require('../documentType.model')

const shippingLineList = async ({orgId}) => {
	let filterQuery = {active: true, orgId:mongoose.Types.ObjectId(orgId)}

	const list = await Model.find(filterQuery).select('name _id code').sort({_id: -1});
	const totalCount = await Model.countDocuments(filterQuery)
	const filteredCount = await Model.countDocuments(filterQuery)
	return {
		data: list,
		totalCount,
		filteredCount,
	};
};


module.exports = shippingLineList