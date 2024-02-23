const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
//   const { name, description, layout } = await pick(req.body, ['name', 'layout', "description"]);
    // const userId = req.user._id
    const { orgId, _id:userId } = pick(req.user._doc, ['orgId',"_id"])

  const list = await service.addFieldGroup({ ...req.body, updatedBy: userId, createdBy: userId, orgId});
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;