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

	const user = await service.update(userId, body,orgId)
	if(user) sendResponse(res, httpStatus.OK, "User updated", null)
	else throw new ApiError(httpStatus.BAD_REQUEST, "Not able to update user", false, "")
});

module.exports = updateUser