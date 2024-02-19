const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const generateMatrix = catchAsync(async (req, res) => {
  const {limit} = pick(req.query, ["limit"])
  const matrixArr = await service.generateMatrix({limit});
  sendResponse(res, httpStatus.OK, matrixArr, null);
});

module.exports = generateMatrix;