const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const pick = require("../../../utils/pick");

const update = catchAsync(async (req, res) => {
	const body = req.body;
	const { id } = pick(req.params, ["id"])
    const {isOverride} = pick(req.body,['isOverride'])
    const formattedDate = new Date().toISOString();
    const userID =req.user._id

    let user
    if (isOverride) {
	user = await service.updateLabel({ id, data: {...body,oclUpdatedBy:userID,oclUpdatedAt: formattedDate}, userId: userID })
    }else{
	user = await service.updateLabel({ id, data: body, userId: userID })
    }
	if (user) sendResponse(res, httpStatus.OK, "Label updated successfully", null)
	else sendResponse(res, httpStatus.BAD_REQUEST, null, "Not able to update")
});

module.exports = update