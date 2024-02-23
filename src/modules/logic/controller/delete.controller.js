const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteLogicById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const { orgId } = await pick(req.user._doc, ["orgId"])
    const logic = await service.deleteLogic({ id, userId: req.user._id, orgId })
    if (logic) sendResponse(res, httpStatus.OK, logic, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, logic)
})

module.exports = deleteLogicById