const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");
const ApiError = require("../../../utils/ApiError");

const add = catchAsync(async (req, res) => {
  const {
    name,
    modelId,
    logo,
    description,
    code,
  } = await pick(req.body, ["modelId", "name", "logo", "description", "code"]);
  const data = await service.addDocumentType({
    name,
    modelId,
    logo,
    description, code
  })

  if (data) {
    sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not able to add", false, ".")
  }
});

module.exports = add;
