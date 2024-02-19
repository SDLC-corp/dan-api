const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const getFieldById = catchAsync(async (req, res) => {
    const { id } = pick(req.query, ["id"])
    const field = await service.getDomain(id);
    if (field) sendResponse(res, httpStatus.OK, field, null);
    else sendResponse(res, httpStatus.BAD_REQUEST, null, "Domain not found");
});
module.exports = getFieldById;