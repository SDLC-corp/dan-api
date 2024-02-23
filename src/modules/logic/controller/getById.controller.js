const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const getLabelById = catchAsync(async (req, res) => {
    const { id } = pick(req.params, ["id"])
    const { orgId } =  pick(req.user._doc, ["orgId"])
    const field = await service.getLogicById({id,orgId});
    if (field) sendResponse(res, httpStatus.OK, field, null);
    else sendResponse(res, httpStatus.BAD_REQUEST, null, `Logic not found`);
});
module.exports = getLabelById;