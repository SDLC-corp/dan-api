const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const listController = catchAsync(async (req, res) => {
    const { 
        limit,
        page,
        search,
        all 
    } = pick(req.query, ["limit", "page", "search", "all"])
    let filter_Json_data = search ? JSON.parse(search) : null;

    let list = await service.listRole({ limit, page, all },filter_Json_data);
    sendResponse(res, httpStatus.OK, list, null);
});
module.exports = listController;