const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteDocumentByMail = catchAsync(async (req, res) => {
    const loggedInUser = req.user.id
    const { id } = pick(req.params, ["id"])
    const { orgId } = pick(req.user._doc,["orgId"])

    const logic = await service.deleteDocumentByMail({ id,loggedInUser,orgId })
    if (logic) sendResponse(res, httpStatus.OK, logic, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, logic)
})

module.exports = deleteDocumentByMail