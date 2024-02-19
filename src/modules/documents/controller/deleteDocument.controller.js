const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteDocumentById = catchAsync(async (req, res) => {
    const loggedInUserId = req.user._id
    const { id } = pick(req.params, ["id"])
    const logic = await service.deleteDocumentById({ id,loggedInUserId })
    if (logic) sendResponse(res, httpStatus.OK, logic, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, logic)
})

module.exports = deleteDocumentById