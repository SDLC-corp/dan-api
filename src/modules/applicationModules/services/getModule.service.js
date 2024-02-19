const Model = require('../modules.model')

const ModuleList = async () => {
	let filterQuery = {active: true}

	const list = await Model.find(filterQuery).sort({_id: -1});
	return list
};


module.exports = ModuleList