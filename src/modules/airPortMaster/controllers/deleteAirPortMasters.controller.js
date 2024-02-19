const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deletePortMasterById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const portMaster = await service.deletePortMaster(id)
    if (portMaster) sendResponse(res, httpStatus.OK, portMaster, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, portMaster)
})

module.exports = deletePortMasterById