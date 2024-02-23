const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const list = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const { orgId } = await pick(req.user._doc, ["orgId"]);
  const data = await service.getUserById({id,orgId});
  if(data){
      sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found", {}, "")
  }
});

module.exports = list;
