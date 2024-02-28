const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const update = catchAsync(async (req, res) => {
    console.log('req.user',req.user);
    const { id } = pick(req.params,["id"])
     const { orgId } = pick(req.user._doc, ['orgId'])
    const list = await service.updateFieldGroup({ objectId:id,data:req.body, updatedBy: req.user.id,orgId});
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = update;