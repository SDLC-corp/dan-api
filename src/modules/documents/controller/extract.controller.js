const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const extractFields = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const data = await service.getPrediction(id)
  if(data){
      sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "document Not Found", {}, "")
  }
});

module.exports = extractFields;
