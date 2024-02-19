const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const updateField = catchAsync(async (req, res) => {
  const {documentId} = pick(req.params, ["documentId"])
  const {overrideValue, fieldName, isShipUnit} = pick(req.body, ["fieldName", "overrideValue", "isShipUnit"])
  console.log("updateField controller , ", documentId, fieldName, overrideValue);
  const updated = await service.updateField({documentId, fieldName, overrideValue, isShipUnit});
  sendResponse(res, httpStatus.OK, updated, null);
});
module.exports = updateField;