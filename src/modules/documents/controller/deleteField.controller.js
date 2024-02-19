const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const deleteField = catchAsync(async (req, res) => {
  const {documentId} = pick(req.params, ["documentId"])
  const {itemId, isShipUnit} = pick(req.body, ["itemId", "isShipUnit"])

  const deleted = await service.deleteField({itemId, isShipUnit,documentId});
    if (deleted) sendResponse(res, httpStatus.OK, deleted, null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, deleted)
});
module.exports = deleteField;