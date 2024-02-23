const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const {
    label,
    documentTypeId,
    fieldId,
    logicCodeId,
    isOverride,
    overrideCustomLogic
  } = await pick(req.body, ['label', 'documentTypeId', 'fieldId', "logicCodeId", "isOverride", "overrideCustomLogic"]);
    let id = req.user._id
    const formattedDate = new Date().toISOString();

    const {orgId,_id} = pick(req.user._doc,["orgId","_id"])

  let result = {}
  if (isOverride) {
    result = {
      label,
      documentTypeId,
      fieldId,
      isOverride,
      overrideCustomLogic,
      oclCreatedBy:_id,
      oclUpdatedBy:_id,
      oclCreatedAt:formattedDate,
      oclUpdatedAt: formattedDate  
    }
  } else {
    result = {
      label,
      documentTypeId,
      fieldId,
      logicCodeId,
    //   isOverride,
    //   overrideCustomLogic,
    }
  }

  const created = await service.addLabel({ ...result, userId: _id,orgId });

  sendResponse(res, httpStatus.OK, created, null);
});

module.exports = add;