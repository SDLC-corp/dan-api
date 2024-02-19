const mongoose = require("mongoose"); // Import mongoose if not imported previously
const Model = require("../domain.model");

const getDomain = async (id) => {
    try {
        const filterQuery = {active:true}
        const response = await Model.find(filterQuery)
        return response
    } catch (error) {
        console.error("Error in getDomain:", error);
        return null; // You might want to consider throwing the error here instead
    }
};

module.exports = getDomain;
