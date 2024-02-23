const mongoose  = require("mongoose");
const Model = require("../fieldGroups.model");

const listAll = async ({ordId}) => {

    let filterQuery = { active: true, ordId: mongoose.Types.ObjectId(ordId)};
    const list = await Model.find(filterQuery)
        .sort({ _id: -1 })

    if (list) {
        return { data: list }
    } else {
        return null
    }
};

module.exports = listAll;
