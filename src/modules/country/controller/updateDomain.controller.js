const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const updateDomainById = catchAsync(async (req, res) => {

    const { id } = await pick(req.params, ["id"])
    const { label } = await pick(req.body, ["label"])
    const domain = await service.updateDomainById({id,label});
    if (domain) sendResponse(res, httpStatus.OK, domain, null);
    else sendResponse(res, httpStatus.BAD_REQUEST, null, "Domain not found");
});
module.exports = updateDomainById;