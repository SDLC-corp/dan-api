const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteDocumentById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const {orgId, role} = pick(req.user._doc,["orgId", "role"])
    
    const logic = await service.deleteDocumentById({ id ,orgId, role})
    if (logic) sendResponse(res, httpStatus.OK, logic, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, logic)
})

module.exports = deleteDocumentById