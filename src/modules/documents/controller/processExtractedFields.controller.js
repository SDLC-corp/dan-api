const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const processExtractedFields = catchAsync(async (req, res) => {
    const { documentId } = pick(req.params, ["documentId"])
    const userData = req.user
    const data = await service.processExtractedFields(documentId)
    if (data) {
        sendResponse(res, httpStatus.OK, data, null);
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, "document Not Found", {}, "")
    }
});

module.exports = processExtractedFields;
