const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");
const pick = require("../../../utils/pick");

const update = catchAsync(async (req, res) => {
	const body = req.body;
	const {id} = pick(req.params, ["id"])

	const user = await service.updateShippingLine({id, data: body})
	if(user) sendResponse(res, httpStatus.OK, "Shipping Line data updated", null)
	else sendResponse(res, httpStatus.BAD_REQUEST, null, "Not able to update") 
});

module.exports = update