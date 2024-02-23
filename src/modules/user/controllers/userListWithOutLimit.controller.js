const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const listWithOutLimit = catchAsync(async (req, res) => {
  const { search } = await pick(req.query, ["search"]);
  const { orgId } = await pick(req.user._doc, ["orgId"]);
  const filter_Json_data = search ? JSON.parse(search) : null
  const list = await service.listControllerWithoutLimit({search:filter_Json_data,orgId});
  sendResponse(res, httpStatus.OK, list, null);
});
module.exports = listWithOutLimit;
