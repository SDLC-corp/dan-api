const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const listModule = catchAsync(async (req, res) => {
    const rolesList = await service.moduleList();
    if (rolesList) sendResponse(res, httpStatus.OK, rolesList, null);
    else sendResponse(res, httpStatus.BAD_REQUEST, null, "Roles not found");
});
module.exports = listModule;