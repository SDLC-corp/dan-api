const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
    const {
        name, description,disabledModules
    } = await pick(req.body, ['name', 'description', 'disabledModules']);
    const created = await service.addRole({ name, description,disabledModules});
    sendResponse(res, httpStatus.OK, created, null);
});

module.exports = add;