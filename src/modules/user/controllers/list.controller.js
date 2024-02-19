const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
  const { limit, page, search } = await pick(req.query, ["limit", "page", "search"]);
  const filter_Json_data = search ? JSON.parse(search) : null
  const list = await service.getUsersList({limit, page},filter_Json_data);
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;
