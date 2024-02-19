const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const getIsoCodeById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const isoCode = await service.getById(id);
    if (isoCode) sendResponse(res, httpStatus.OK, isoCode, null);
    else sendResponse(res, httpStatus.BAD_REQUEST, null, `Container Iso Code Not found`);
});
module.exports = getIsoCodeById;