const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const { paramName, displayName, regx, fieldType, fieldTableValue, fieldTextValue, fieldNumValue,master,dateFormat,fieldGroupId } = await pick(req.body, ['paramName', 'displayName', "regx", "fieldType", 'fieldTableValue', 'fieldTextValue', 'fieldNumValue','master',"fieldGroupId"]);

  const list = await service.addField({ paramName, displayName, regx, fieldType, fieldTableValue, fieldTextValue, fieldNumValue, updatedBy: req.user._id, createdBy: req.user._id ,master,dateFormat,fieldGroupId});

  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;