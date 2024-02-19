const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const listWithOutLimit = catchAsync(async (req, res) => {
  const { search } = await pick(req.query, ["search"]);
  const filter_Json_data = search ? JSON.parse(search) : null
  const list = await service.listControllerWithoutLimit(filter_Json_data);
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = listWithOutLimit;
