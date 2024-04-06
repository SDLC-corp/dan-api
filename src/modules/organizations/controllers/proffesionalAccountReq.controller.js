const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const { sendResponse } = require("../../../utils/responseHandler");
const services = require("../services");
const pick = require("../../../utils/pick");

const proffesionalAccountReq = catchAsync(async (req, res) => {
    const { name, email, phone, orgName, comment } = await pick(req.body, [
        "name",
        "email",
        "phone",
        "orgName",
        "comment",
    ]);

    const response = await services.proffesionalAccountReq({ name, email, phone, orgName, comment });
    if (response.status) {
        sendResponse(res, httpStatus.OK, response.data, null);
    } else {
        sendResponse(
            res,
            httpStatus.BAD_REQUEST,
            response.data || "Something Went Wrong!",
            null,
        );
    }
});

module.exports = proffesionalAccountReq;
