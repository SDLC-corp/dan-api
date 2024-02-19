const mongoose = require('mongoose');
const Model = require('../domain.model');

const updateDomainById = async ({id, label}) => {
    try {
        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(id) };
        const updateResult = await Model.findOneAndUpdate(filterQuery, { label:label }, { new: true });
        if (updateResult) return { data: updateResult, status: true, code: 200 }
        else return { data: "Domain Not Found", status: false, code: 400 }
    } catch (error) {
        return { data: error.message, status: false, code: 500 }
    }
};

module.exports = updateDomainById
