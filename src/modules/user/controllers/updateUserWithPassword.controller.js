const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");
const pick = require("../../../utils/pick");

const updateUser = catchAsync(async (req, res) => {
	const body = req.body;
	let userId = req.params.id;
	const {orgId} = await pick(req.user._doc, ["orgId"]);
	const user = await service.updatePassword({userId, body,orgId})
	if(user) sendResponse(res, httpStatus.OK, "Password updated.", null)
	else throw new ApiError(httpStatus.BAD_REQUEST, "Not able to update password.", false, "")
});

module.exports = updateUser