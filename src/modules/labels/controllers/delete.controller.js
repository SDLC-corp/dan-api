const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteLabel = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const field = await service.deleteLabel({ id, userId: req.user._id })
    if (field) sendResponse(res, httpStatus.OK, "Label Deleted successfully", null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, "Label Not Delete")
})

module.exports = deleteLabel