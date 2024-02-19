const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const {
    label,
    shippingLineId,
    fieldId,
    logicCodeId,
    isOverride,
    overrideCustomLogic
  } = await pick(req.body, ['label', 'shippingLineId', 'fieldId', "logicCodeId", "isOverride", "overrideCustomLogic"]);
    let id = req.user._id
    const formattedDate = new Date().toISOString();
  let result = {}
  if (isOverride) {
    result = {
      label,
      shippingLineId,
      fieldId,
      isOverride,
      overrideCustomLogic,
      oclCreatedBy:id,
      oclUpdatedBy:id,
      oclCreatedAt:formattedDate,
      oclUpdatedAt: formattedDate  
    }
  } else {
    result = {
      label,
      shippingLineId,
      fieldId,
      logicCodeId,
    //   isOverride,
    //   overrideCustomLogic,
    }
  }

  const created = await service.addLabel({ ...result, userId: id });

  sendResponse(res, httpStatus.OK, created, null);
});

module.exports = add;