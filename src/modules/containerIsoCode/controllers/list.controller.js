const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
    console.log('req.query',req.query);
  const { limit,  search } = await pick(req.query, ["limit", "search"]); 
  const list = await service.isoCodesList(limit,search);
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;



