const Model = require("../shippingLine.model")

async function addShippingLine(data) {
    let created = await Model.create(data)
    return created
}

module.exports = addShippingLine