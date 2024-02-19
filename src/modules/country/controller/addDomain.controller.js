const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const { 
    label,parentId
   } = await pick(req.body, ['label','parentId']);

  const created = await service.addDomain({
    label,parentId
  });
  
  sendResponse(res, httpStatus.OK, created, null);
});

module.exports = add;