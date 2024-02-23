const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
    const {
        name, shortCode, textArea,dependency
    } = await pick(req.body, ['name', 'shortCode', 'textArea',"dependency"]);

    const {orgId} = await pick(req.user._doc,["orgId"])

    const created = await service.addLogic({
        name, shortCode, textArea,dependency, userId: req.user._id,
        orgId,
    });
    sendResponse(res, httpStatus.OK, created, null);
});

module.exports = add;