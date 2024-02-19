const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
    console.log('req.body',req.body);
    const {
        name, shortCode, textArea,dependency
    } = await pick(req.body, ['name', 'shortCode', 'textArea',"dependency"]);

    const created = await service.addLogic({
        name, shortCode, textArea,dependency, userId: req.user._id
    });
    sendResponse(res, httpStatus.OK, created, null);
});

module.exports = add;