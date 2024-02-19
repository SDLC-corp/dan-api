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
    type,
    locationName,
    locationId
  } = await pick(req.body, ["modelId", "name", "logo", "description", "code",
    "type",
    "locationName",
    "locationId"]);
  const data = await service.addShippingLine({
    name,
    modelId,
    logo,
    description, code,locationName,
    locationId,type
  })

  if (data) {
    sendResponse(res, httpStatus.OK, data, null);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not able to add", false, ".")
  }
});

module.exports = add;
