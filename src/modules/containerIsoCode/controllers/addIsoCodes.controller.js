const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const add = catchAsync(async (req, res) => {
  const {text,code,description} = await pick(req.body, ["text", "code", "description"]);
  const data = await service.addIsoCodes({  text,code,description,createdBy:req.user._id})
  if(data){
      sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not able to add", false, ".")
  }
});

module.exports = add;
