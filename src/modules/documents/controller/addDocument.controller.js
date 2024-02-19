const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { sendResponse } = require("../../../utils/responseHandler");
const service = require("../services");

const add = catchAsync(async (req, res) => {
  const createdBy = req.user._id
  let assignTo 
  const { 
    domainName,
    shippingLineId,
    documentUrl,
    bookingNo,
    documentType,
    stageType,
    documentNo,assignToUserId } = await pick(req.body,
     ['domainName', 'shippingLineId','documentUrl','documentType','stageType','documentNo', 'bookingNo',"assignToUserId",]);

     console.log("req.params",req.query);
    const {extractionType} = await pick(req.query,["extractionType"])
    console.log("extractionType",extractionType);

    if (req.user.role != "documentation" && assignToUserId) {
        // admin
        assignTo = assignToUserId
    }else{
        assignTo = createdBy
    }

  const list = await service.addDocument({ domainName, shippingLineId,documentUrl,documentType,stageType,documentNo,createdBy,assignTo, bookingNo,extractionType});
  sendResponse(res, httpStatus.OK, list, null);
});

module.exports = add;