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

  const {orgId} = pick(req.user._doc,["orgId"])

  const list = await service.addDocument({ 
    documentTypeId,
    documentUrl,
    assignTo,
    orgId,
    createdBy});
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;