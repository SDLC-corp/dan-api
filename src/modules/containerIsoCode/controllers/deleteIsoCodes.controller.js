const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteISOCodes = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const ISOCode = await service.deleteContainerISOCode(id)
    if (ISOCode) sendResponse(res, httpStatus.OK, ISOCode, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, ISOCode)
})

module.exports = deleteISOCodes