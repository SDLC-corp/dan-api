const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const { id } = await pick(req.params, ['id']);

  const list = await service.getFieldGroup(id);
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;