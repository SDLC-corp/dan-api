const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const list = catchAsync(async (req, res) => {
    const { ordId } = await pick(req.user._doc, ['ordId']);

    const list = await service.listFieldGroupService({ordId});
    if (list) {
        sendResponse(res, httpStatus.OK, list, null);
    }else{
        throw new ApiError(httpStatus.BAD_REQUEST, "Not Able to Fetch", true, "error")
    }
});

module.exports = list;