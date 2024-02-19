const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const addJob = catchAsync(async (req, res) => {
    const userData = req.user
    const {documentId} = pick(req.body, ["documentId"])

    const added = await service.addJobProcess({documentId, userData});
    sendResponse(res, httpStatus.OK, added, null);
});

module.exports = addJob;