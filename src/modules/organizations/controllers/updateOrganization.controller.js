const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const pick = require("../../../utils/pick");

const update = catchAsync(async (req, res) => {
    const { syncApiUrl } = pick(req.body, ["syncApiUrl"])
    const { orgId } = pick(req.user._doc, ["orgId"])
    console.log("orgId :", orgId, ", syncApiUrl :", syncApiUrl);
    const result = await service.update({ syncApiUrl, orgId })
    if (result) sendResponse(res, httpStatus.OK, "URL Updated Successfully!", null)
    else sendResponse(res, httpStatus.BAD_REQUEST, null, "Not able to update URL")
});

module.exports = update