const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const pick = require("../../../utils/pick");

const update = catchAsync(async (req, res) => {
	const body = req.body;
	const { id } = pick(req.params, ["id"])
	const { orgId } = pick(req.user._doc, ["orgId"])

	const user = await service.updateField({ id, data: body, userId: req.user._id ,orgId})
	if (user) sendResponse(res, httpStatus.OK, "Field Updated Successfully!", null)
	else sendResponse(res, httpStatus.BAD_REQUEST, null, "Not able to update Field")
});

module.exports = update