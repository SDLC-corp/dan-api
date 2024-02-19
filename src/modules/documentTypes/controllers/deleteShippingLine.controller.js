const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteShippingLineById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const shippingLine = await service.deleteShippingLine(id)
    if (shippingLine) sendResponse(res, httpStatus.OK, shippingLine, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, shippingLine)
})

module.exports = deleteShippingLineById