const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteLogicById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const { orgId, role } = pick(req.user._doc, ["orgId", "role"])
    const response = await service.deleteRole({ id, orgId, role })
    if (response.status) {
        sendResponse(res, httpStatus.OK, response.data, null)
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, response.data || 'Something Went Wrong!', null)
    }
})

module.exports = deleteLogicById