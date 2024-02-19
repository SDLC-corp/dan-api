const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const assignUsers = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ["id"]);
  const { userId } = await pick(req.body, ["userId"]);
    console.log('req.body',req.body);
  const data = await service.assignToUser({documentId:id,userId})
  if(data){
      sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not Found", {}, "")
  }
});

module.exports = assignUsers;
