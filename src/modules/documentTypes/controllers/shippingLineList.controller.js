const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {

  const list = await service.shippingLineListWithoutLimit();
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;
