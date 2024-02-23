const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const { convertToJSON } = require("../../../utils/helper");

const list = catchAsync(async (req, res) => {
    const {limit, page, search} = pick(req.query, ["limit", "page", "search"])
    const { orgId } = pick(req.user._doc, ["orgId"])
    const list = await service.list({limit, page, orgId, search});
    sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;