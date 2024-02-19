const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const pick = require("../../../utils/pick");

const update = catchAsync(async (req, res) => {
    const body = req.body;
    const { id } = pick(req.params, ["id"])

    const user = await service.updateRole({ id, data: body})
    if (user) sendResponse(res, httpStatus.OK, "Role updated successfully", null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, "Not able to update")
});

module.exports = update