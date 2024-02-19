const Model = require("../fieldGroups.model");

const listAll = async () => {

    let filterQuery = { active: true };
    const list = await Model.find(filterQuery)
        .sort({ _id: -1 })

    if (list) {
        return { data: list }
    } else {
        return null
    }
};

module.exports = listAll;
