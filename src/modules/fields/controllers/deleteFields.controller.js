const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const deleteFieldById = catchAsync(async (req, res) => {
  const {id} = pick(req.params, ["id"])
  const field = await service.deleteFieldsServices(id);
  if(field) sendResponse(res, httpStatus.OK, field, null);
  else sendResponse(res, httpStatus.BAD_REQUEST, null, "Field not found");
});
module.exports = deleteFieldById;