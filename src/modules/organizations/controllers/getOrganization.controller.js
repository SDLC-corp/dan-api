const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const getOrgdById = catchAsync(async (req, res) => {
  const {orgId} = pick(req.user._doc, ["orgId"])
  console.log(orgId);
  const field = await service.getOrgdById({orgId});
  console.log(field);
  if(field) sendResponse(res, httpStatus.OK, field, null);
  else sendResponse(res, httpStatus.BAD_REQUEST, null, "Field not found");
});
module.exports = getOrgdById;