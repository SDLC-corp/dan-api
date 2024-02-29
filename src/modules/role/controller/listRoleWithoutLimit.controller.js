const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const listController = catchAsync(async (req, res) => {
    // const { 
    //     limit,
    //     page,
    //     search,
    //     all 
    // } = pick(req.query, ["limit", "page", "search", "all"])
    // let filter_Json_data = search ? JSON.parse(search) : null;

    const { orgId, role} = pick(req.user._doc,["orgId", "role"])

    let list = await service.listRoleWithoutLimit({orgId, role});
    sendResponse(res, httpStatus.OK, list, null);
});
module.exports = listController;