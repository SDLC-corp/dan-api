const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const updatedBy = req.user._id
  const { id } = await pick(req.params, ["id"]);

  const list = await service.updateDocument({id:id,body:req.body});
    if (list) {
      sendResponse(res, httpStatus.OK, list, null);
    }else{
       throw new ApiError(httpStatus.BAD_REQUEST, "document Not Uploaded", list)
    }
});

module.exports = add;