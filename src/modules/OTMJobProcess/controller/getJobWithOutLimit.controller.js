const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
  const {search,fromDate,toDate} = pick(req.query, ["search","fromDate","toDate"])
  const list = await service.getJobListWithOutLimit(search,fromDate,toDate);
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;
