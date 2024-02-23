const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const list = catchAsync(async (req, res) => {
    console.log("req.user.orgId",req.user._doc.orgId);
    const {limit, page, search} = pick(req.query, ["limit", "page", "search"])
    let filter_Json_data = search ? JSON.parse(search) : null;
    const list = await service.list({limit, page, user:req.user._doc, search:filter_Json_data});
    sendResponse(res, httpStatus.OK, list, null);
});
module.exports = list;