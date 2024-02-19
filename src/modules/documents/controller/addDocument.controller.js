const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const createdBy = req.user._id
  const assignTo = createdBy
  const { 
    documentTypeId,
    documentUrl,
     } = await pick(req.body,[ "documentTypeId", "documentUrl"]);

  const list = await service.addDocument({ 
    documentTypeId,
    documentUrl,
    assignTo,
    createdBy});
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;