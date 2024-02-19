const Model = require("../shippingLine.model")
const mongoose = require('mongoose');

async function update({id, data}) {
    let filterQuery = {active: true, _id: mongoose.Types.ObjectId(id)}
    let update = await Model.findOneAndUpdate(filterQuery, data)
    return update
}

module.exports = update