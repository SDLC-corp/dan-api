const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const list = catchAsync(async (req, res) => {
    const {limit, page,search} = pick(req.query, ["limit", "page","search"])
    let filter_Json_data = search ? JSON.parse(search) : null;
    const list = await service.listFieldGroup({limit, page},filter_Json_data);
    if (list) {
        sendResponse(res, httpStatus.OK, list, null);
    }else{
        throw new ApiError(httpStatus.BAD_REQUEST, "Not Able to Fetch", true, "error")
    }
});

module.exports = list;