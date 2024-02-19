const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
  const {limit, page, search,fromDate,toDate} = pick(req.query, ["limit", "page", "search","fromDate","toDate"])
//   let filter_Json_data = search ? JSON.parse(search) : null;
  const list = await service.getJobList({limit, page},search,fromDate,toDate,req.user);
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;
