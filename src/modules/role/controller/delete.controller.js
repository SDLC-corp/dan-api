const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteLogicById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const role = await service.deleteRole({ id })
    if (role) sendResponse(res, httpStatus.OK, role, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, role)
})

module.exports = deleteLogicById