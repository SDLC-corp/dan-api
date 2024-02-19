const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
  const { limit, page, search,type } = await pick(req.query, ["limit", "page","search","type"]);
  const filter_Json_data = search ? JSON.parse(search) : null
  const list = await service.shippingLineList({limit, page},filter_Json_data,type);
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;
