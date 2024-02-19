const httpStatus = require("http-status")
const catchAsync = require("../../../utils/catchAsync")
const { sendResponse } = require("../../../utils/responseHandler")
const service = require("../services")
const pick = require("../../../utils/pick")

const deleteDocumentByMail = catchAsync(async (req, res) => {
    const loggedInUser = req.user.id
    const { domainName } = await pick(req.query, ["domainName"]);
    const { id } = pick(req.params, ["id"])

    const logic = await service.deleteDocumentByMail({ id,loggedInUser },domainName)
    if (logic) sendResponse(res, httpStatus.OK, logic, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, logic)
})

module.exports = deleteDocumentByMail