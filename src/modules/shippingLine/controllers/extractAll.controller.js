const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const list = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const option = req.body.option;
  const data = await service.extractAllShippingLine(id, option)
  if(data){
      sendResponse(res, httpStatus.OK, "Extraction Completed", null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error in extraction", {}, "")
  }
});

module.exports = list;
