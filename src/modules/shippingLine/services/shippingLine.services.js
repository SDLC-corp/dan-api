const Model = require('../shippingLine.model')

const shippingLineList = async () => {
	let filterQuery = {active: true}

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